local json = {}

local type = type
local pairs = pairs
local ipairs = ipairs
local tostring = tostring
local tonumber = tonumber
local string_char = string.char
local string_byte = string.byte
local string_format = string.format
local string_gsub = string.gsub
local string_match = string.match
local string_sub = string.sub
local string_gmatch = string.gmatch
local table_concat = table.concat
local table_insert = table.insert
local math_floor = math.floor
local setmetatable = setmetatable
local getmetatable = getmetatable
local error = error
local pcall = pcall
local math_huge = math.huge

-- Marker for special Lua types not directly representable in standard JSON
local LUA_TYPE_MARKER = "__lua_json_type"
local LUA_METATABLE_KEY = "__lua_json_metatable"
local LUA_KEY_ORDER_KEY = "__lua_json_key_order"

-- Helper function to check if a table should be treated as a JSON array
-- Checks if keys are sequential integers from 1 to n
local function is_array(tbl)
  local i = 0
  local n = 0
  for k, _ in pairs(tbl) do
    if k ~= LUA_METATABLE_KEY then
      n = n + 1
    end
  end
  if n == 0 then return true end -- Empty table is an array

  for k, _ in pairs(tbl) do
    if k ~= LUA_METATABLE_KEY then
      if type(k) == "number" and k >= 1 and math_floor(k) == k then
        if k > n then return false end -- Key is out of bounds
        i = i + 1
      else
        return false -- Contains non-integer or non-positive key (or complex key)
      end
    end
  end
  return i == n -- Ensure all sequential keys exist
end


-- Escaping characters for JSON strings
local escape_map = {
  [string.char(92)] = "\\\\", -- Backslash
  [string.char(34)] = "\\\"", -- Double quote
  [string.char(8)]  = "\\b",  -- Backspace
  [string.char(12)] = "\\f",  -- Form feed
  [string.char(10)] = "\\n",  -- Newline
  [string.char(13)] = "\\r",  -- Carriage return
  [string.char(9)]  = "\\t",  -- Tab
}

-- Control characters check: U+0000 to U+001F
for i = 0, 31 do
  -- Format as \\uXXXX literal string
  escape_map[string_char(i)] = string_format("\\\\u%04x", i)
end

local function escape_str(s)
  -- Pattern: %c (control), %\ (literal backslash), %" (literal quote)
  return "\"" .. string_gsub(s, "[%c%\\%\"]", escape_map) .. "\""
end


-- Forward declaration for recursive functions
local encode_value
local decode_value
local decode_key_string


-- Encoder function
local function encode_table(val, stack, path, indent, gap, objects_map, options)
  objects_map[val] = path
  local result = {}
  local key_order_result = {} -- Store keys in deterministic order
  local mt = getmetatable(val)

  local new_indent = indent .. gap
  local obj_gap = gap ~= "" and " " or "" -- Space after colon if pretty

  -- Encode Metatable if it exists
  if mt then
    local mt_path = path .. "[<mt>]"
    local encoded_mt = encode_value(mt, stack, mt_path, new_indent, gap, objects_map, options)
    table_insert(result, escape_str(LUA_METATABLE_KEY) .. ":" .. obj_gap .. encoded_mt)
    -- Do not add metatable key to key_order_result
  end

  -- Iterate deterministically (Factorio pairs is deterministic)
  -- Collect keys and values first
  local collected_keys = {}
  for k, _ in pairs(val) do
    table_insert(collected_keys, k)
    -- Factorio guarantees order based on insertion, so simple pairs is fine here for order capture.
    -- For absolute robustness across potential future Lua changes, one might sort non-numeric keys,
    -- but relying on Factorio's documented pairs behavior is intended here.
  end

  -- Encode Key/Value pairs using the collected order
  for _, k in ipairs(collected_keys) do
    local v = val[k]
    -- Skip the manually added metatable key if we somehow iterate over it (shouldn't happen)
    -- if k == LUA_METATABLE_KEY then goto continue end

    local key_type = type(k)
    local key_str_encoded   -- The key string as it appears in JSON (escaped, potentially prefixed)
    local key_str_for_order -- The key string to put in the key order array (just escaped)

    if key_type == "string" or key_type == "number" then
      local simple_key_str = tostring(k)
      key_str_encoded = escape_str(simple_key_str)
      key_str_for_order = simple_key_str -- Store the raw string/number-as-string
    else
      -- Encode non-string/number key using encode_value recursively (limited depth)
      local key_options = { maxDepth  = options.maxKeyDepth  or 5 }
      local encoded_key_json = encode_value(k, {}, path .. "[<key>].", "", "", {}, key_options)
      local prefixed_key = "__lua_json_key:" .. encoded_key_json
      key_str_encoded = escape_str(prefixed_key)
      key_str_for_order = prefixed_key -- Store the prefixed key
    end

    local element_path = path .. "[" .. key_str_encoded .. "]"
    local str_val = encode_value(v, stack, element_path, new_indent, gap, objects_map, options)
    table_insert(result, key_str_encoded .. ":" .. obj_gap .. str_val)
    table_insert(key_order_result, escape_str(key_str_for_order)) -- Add escaped key string to order list

    -- ::continue::
  end

  -- Add the key order array if there were keys other than the metatable
  if #key_order_result > 0 then
    local key_order_str = "[" .. table_concat(key_order_result, ",") .. "]"
    table_insert(result, escape_str(LUA_KEY_ORDER_KEY) .. ":" .. obj_gap .. key_order_str)
  end


  -- Determine braces based on number of entries (including metatable and key order)
  if #result == 0 then
    return "{}" -- Truly empty object
  elseif gap == "" then
    -- Compact output
    -- Always use simple comma concatenation for compact output
    return "{" .. table_concat(result, ",") .. "}"
  else
    -- Pretty print
    -- Use comma, newline, and indentation ONLY for pretty printing
    local content = table_concat(result, ",\n" .. new_indent)
    return "{\n" .. new_indent .. content .. "\n" .. indent .. "}"
  end
end

encode_value = function(val, stack, path, indent, gap, objects_map, options)
  local t = type(val)

  if t == "string" then
    return escape_str(val)
  elseif t == "number" then
    -- Handle Inf/NaN for lossless representation
    if val ~= val then -- NaN check
      -- Construct valid JSON string: {"__lua_json_type":true,"type":"number","value":"NaN"}
      return string_format('{"%s":true,"type":"number","value":"NaN"}', LUA_TYPE_MARKER)
    elseif val == math_huge then
      -- Construct valid JSON string: {"__lua_json_type":true,"type":"number","value":"+Inf"}
      return string_format('{"%s":true,"type":"number","value":"+Inf"}', LUA_TYPE_MARKER)
    elseif val == -math_huge then
      -- Construct valid JSON string: {"__lua_json_type":true,"type":"number","value":"-Inf"}
      return string_format('{"%s":true,"type":"number","value":"-Inf"}', LUA_TYPE_MARKER)
    else
      -- Standard finite number
      return tostring(val)
    end
  elseif t == "boolean" then
    return tostring(val)
  elseif t == "nil" then
    return "null"
  elseif t == "table" then
    -- Cycle detection
    local existing_path = objects_map[val]
    if existing_path then
      -- Construct valid JSON string for cycle reference: {"$ref":"path"}
      -- Use escape_str on the path to ensure it's a valid JSON string within the ref object.
      return string_format('{"$ref":%s}', escape_str(existing_path))
    end

    -- Check stack depth to prevent infinite recursion on non-cyclic deep structures
    if #stack > (options.maxDepth  or 100) then
      error("Cannot encode excessively deep structure")
    end

    table_insert(stack, val)
    local success, result = pcall(encode_table, val, stack, path, indent, gap, objects_map, options)
    table.remove(stack) -- Pop from stack

    if not success then
      error("Cannot encode table: " .. result)
    end
    return result
  elseif t == "function" or t == "userdata" or t == "thread" then
    -- JSON cannot represent these types directly. Encode as null or error, or use a special marker.
    if options.errorOnUnsupportedType then
      error("Unsupported type '" .. t .. "' found during JSON encoding at path " .. path)
    else
      -- Encode with a marker, will decode to nil. Full revival is impossible.
      -- Construct valid JSON string: {"__lua_json_type":true,"type":"unsupported","original_type":"typename"}
      return string_format('{"%s":true,"type":"unsupported","original_type":"%s"}', LUA_TYPE_MARKER, t)
    end
  else
    error("Unhandled type '" .. t .. "' during JSON encoding at path " .. path)
  end
end

--- Encodes a Lua value into a JSON string.
-- @param value The Lua value to encode.
-- @param options (optional) Table of options:
--    space: Indentation string (e.g., "  " or "\t") or number of spaces for pretty printing.
--    maxDepth : Maximum recursion depth for values (default 100).
--    maxKeyDepth : Maximum recursion depth for table keys (default 5).
--    errorOnUnsupportedType: Boolean, if true, throws error on functions/userdata/threads (default false, encodes with marker).
-- Note: Metatables are encoded using a `__lua_json_metatable` key. Functions within metatables become nil on decode.
-- @return JSON string or throws an error.
function json.encode(value, options)
  options = options or {}
  local gap = ""
  local indent_str = ""

  if options.space then
    if type(options.space) == "number" then
      for _ = 1, options.space do gap = gap .. " " end
    elseif type(options.space) == "string" then
      gap = options.space
    end
  end

  local objects_map = {}                      -- { [table] = path_string }
  setmetatable(objects_map, { __mode = "k" }) -- Weak keys like WeakMap

  local success, result = pcall(encode_value, value, {}, "$", indent_str, gap, objects_map, options)

  if not success then
    error("JSON encoding failed: " .. result)
  end
  return result
end

-- Parser state variables
local json_str
local json_pos
local json_len
local special_number_map = {
  ["+Inf"] = math_huge,
  ["-Inf"] = -math_huge,
  ["NaN"] = 0 / 0 -- Standard way to get NaN in Lua
}

local function skip_whitespace()
  while json_pos <= json_len do
    local c = string_sub(json_str, json_pos, json_pos)
    -- Check for space, tab, newline, carriage return
    if c == " " or c == "\\t" or c == "\\n" or c == "\\r" then
      json_pos = json_pos + 1
    else
      break
    end
  end
end

local function parse_error(message)
  error(string_format("JSON parsing error at position %d: %s", json_pos, message))
end

local function expect_char(char)
  skip_whitespace()
  if json_pos > json_len or string_sub(json_str, json_pos, json_pos) ~= char then
    parse_error("Expected '" .. char .. "'")
  end
  json_pos = json_pos + 1
end

local function parse_string()
  expect_char('"')
  local start_pos = json_pos
  local result = ""
  while json_pos <= json_len do
    local byte = string_byte(json_str, json_pos)

    if byte < 32 then parse_error("Control character U+" .. string.format("%04X", byte) .. " in string") end

    local c = string_char(byte)

    if c == '\\\\' then -- Check for literal backslash
      json_pos = json_pos + 1
      if json_pos > json_len then parse_error("Unterminated escape sequence") end
      local next_c = string_sub(json_str, json_pos, json_pos)
      if next_c == '"' or next_c == '\\' or next_c == '/' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. next_c
        start_pos = json_pos + 1
      elseif next_c == 'b' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. "\b"; start_pos = json_pos + 1
      elseif next_c == 'f' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. "\f"; start_pos = json_pos + 1
      elseif next_c == 'n' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. "\n"; start_pos = json_pos + 1
      elseif next_c == 'r' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. "\r"; start_pos = json_pos + 1
      elseif next_c == 't' then
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. "\t"; start_pos = json_pos + 1
      elseif next_c == 'u' then
        local hex = string_sub(json_str, json_pos + 1, json_pos + 4)
        if not string_match(hex, "^[0-9a-fA-F]{4}$") then
          -- Corrected error message string
          parse_error("Invalid unicode escape sequence \\\\u" .. hex)
        end
        local codepoint = tonumber(hex, 16)
        -- Lua 5.2+ handles UTF-8 natively
        result = result .. string_sub(json_str, start_pos, json_pos - 2) .. string_char(codepoint)
        start_pos = json_pos + 5
        json_pos = json_pos + 4 -- Already incremented once for '\\'
      else
        -- Corrected error message string
        parse_error("Invalid escape character '\\\\" .. next_c .. "'")
      end
    elseif c == '"' then
      result = result .. string_sub(json_str, start_pos, json_pos - 1)
      json_pos = json_pos + 1
      return result
    end
    json_pos = json_pos + 1
  end
  parse_error("Unterminated string literal")
end


local function parse_number()
  skip_whitespace()
  local num_str, _ = string_match(json_str, "^%-?%d+%.?%d*[eE]?[%+%-]?%d*", json_pos)
  if not num_str then
    _, num_str = string_match(json_str, "^%-?%.?%d+[eE]?[%+%-]?%d*", json_pos) -- Handle numbers starting with .
  end
  if not num_str then
    parse_error("Invalid number")
  end

  local num = tonumber(num_str)
  if not num then
    parse_error("Cannot convert '" .. num_str .. "' to number")
  end
  json_pos = json_pos + #num_str
  return num
end

local function parse_literal(literal, value)
  skip_whitespace()
  if string_sub(json_str, json_pos, json_pos + #literal - 1) == literal then
    json_pos = json_pos + #literal
    return value
  else
    parse_error("Expected '" .. literal .. "'")
  end
end

local function parse_array(ref_map)
  local arr = {}
  table_insert(ref_map.pending, arr) -- Add to pending list for later reference resolution
  expect_char('[')
  skip_whitespace()

  if string_sub(json_str, json_pos, json_pos) == ']' then
    expect_char(']')
    return arr
  end

  local is_first = true
  while json_pos <= json_len do
    -- Handle commas correctly, allowing trailing comma before ]
    if not is_first then
      expect_char(',')
      skip_whitespace()
      if string_sub(json_str, json_pos, json_pos) == ']' then break end -- Trailing comma
    end
    is_first = false

    local value = decode_value(ref_map)
    table_insert(arr, value)
    skip_whitespace()
    local next_c = string_sub(json_str, json_pos, json_pos)
    if next_c == ']' then
      break -- Handled after loop
    elseif next_c == ',' then
      -- continue loop handled by is_first logic
    else
      parse_error("Expected ']' or ',' in array")
    end
  end
  expect_char(']')
  return arr
end

-- Helper function to decode a potentially prefixed key string
-- This needs to be careful not to interfere with the main parser state
-- It essentially performs a sub-parse on the extracted key JSON
local function decode_key_string_internal(key_json_str)
  -- Temporarily save main parser state
  local main_json_str, main_json_pos, main_json_len = json_str, json_pos, json_len

  -- Set up state for the sub-parse
  json_str = key_json_str
  json_pos = 1
  json_len = #key_json_str

  local ref_map = { -- Create a minimal ref_map for the sub-decode
    pending = {}, refs = {}, visited = {}
  }
  setmetatable(ref_map.visited, { __mode = "k" })

  local success, lua_key = pcall(function()
    local val = decode_value(ref_map)
    skip_whitespace()
    if json_pos <= json_len then
      parse_error("Unexpected characters after key JSON value")
    end
    -- Key decoding should not involve $refs that need resolving relative to the main document
    if #ref_map.refs > 0 then
      parse_error("$ref found within encoded table key is not supported")
    end
    return val
  end)

  -- Restore main parser state
  json_str, json_pos, json_len = main_json_str, main_json_pos, main_json_len

  if not success then
    -- Error message needs context, but using the main pos might be confusing
    error("Failed to decode complex table key JSON: " .. lua_key .. " (Original key JSON: " .. key_json_str .. ")")
  end

  return lua_key
end

decode_key_string = function(parsed_json_string)
  local prefix = "__lua_json_key:"
  if string_sub(parsed_json_string, 1, #prefix) == prefix then
    local key_json = string_sub(parsed_json_string, #prefix + 1)
    return decode_key_string_internal(key_json)
  else
    -- Not a prefixed key, attempt number conversion
    local num_key = tonumber(parsed_json_string)
    if num_key and tostring(num_key) == parsed_json_string then
      return num_key            -- Use the number key if it matches the string representation
    else
      return parsed_json_string -- It's just a regular string key
    end
  end
end

local function parse_object(ref_map)
  -- Parse into temporary KVS first to allow ordered insertion later
  local temp_kvs = {}
  local key_order_array = nil
  local raw_metatable_value = nil

  expect_char('{')
  skip_whitespace()

  if string_sub(json_str, json_pos, json_pos) == '}' then
    expect_char('}')
    return {} -- Empty object, return directly
  end

  local is_first = true
  while json_pos <= json_len do
    -- Handle commas
    if not is_first then
      expect_char(',')
      skip_whitespace()
      if string_sub(json_str, json_pos, json_pos) == '}' then break end
    end
    is_first = false

    local parsed_key_string = parse_string()
    expect_char(':')
    local value = decode_value(ref_map) -- Recursive call

    -- Store in temp map, check for special keys
    if parsed_key_string == LUA_METATABLE_KEY then
      raw_metatable_value = value
    elseif parsed_key_string == LUA_KEY_ORDER_KEY then
      if type(value) ~= "table" or not is_array(value) then -- Should be decoded as an array
        parse_error("Invalid value for " .. LUA_KEY_ORDER_KEY .. ": expected an array")
      end
      key_order_array = value -- Store the array (should contain strings)
    else
      temp_kvs[parsed_key_string] = value
    end

    skip_whitespace()
    local next_c = string_sub(json_str, json_pos, json_pos)
    if next_c == '}' then
      break
    elseif next_c == ',' then
      -- continue loop
    else
      parse_error("Expected '}' or ',' in object")
    end
  end

  expect_char('}')

  -- Now build the final Lua table with ordered insertion if possible
  local obj = {}

  if key_order_array then
    -- Ordered insertion
    local used_keys = {}
    for i = 1, #key_order_array do
      local ordered_key_string = key_order_array[i]
      if type(ordered_key_string) ~= "string" then
        parse_error("Invalid item in key order array: expected string")
      end
      local value = temp_kvs[ordered_key_string]
      if value == nil then
        -- Check if the key existed but value was explicit null vs key not existing
        local key_existed = false
        for k_str, _ in pairs(temp_kvs) do
          if k_str == ordered_key_string then
            key_existed = true; break
          end
        end
        if not key_existed then
          parse_error("Key from order array not found in object: " .. ordered_key_string)
        end
        -- If key existed with null value, proceed
      end

      local lua_key = decode_key_string(ordered_key_string)
      obj[lua_key] = value
      used_keys[ordered_key_string] = true
    end
    -- Check if any keys were in temp_kvs but not in the order array (error?)
    for k_str, _ in pairs(temp_kvs) do
      if not used_keys[k_str] then
        parse_error("Key found in object but not in key order array: " .. k_str)
      end
    end
  else
    -- Unordered insertion (use standard pairs on temp_kvs)
    for parsed_key_string, value in pairs(temp_kvs) do
      local lua_key = decode_key_string(parsed_key_string)
      obj[lua_key] = value
    end
  end

  -- Handle Special Lua Type / $ref markers (check the final obj)
  if obj[LUA_TYPE_MARKER] == true then
    local type = obj.type
    if type == "number" then
      local num_val = special_number_map[obj.value]
      if num_val == nil then parse_error("Invalid special number value: " .. tostring(obj.value)) end
      return num_val
    elseif type == "unsupported" then
      return nil
    elseif obj["$ref"] and type(obj["$ref"]) == "string" then
      -- $ref object with our type marker (encoded cycle)
      table_insert(ref_map.pending, obj)
      table_insert(ref_map.refs, { holder = obj, key_or_index = nil, path = obj["$ref"], ref_obj = obj })
      return obj
    else
      parse_error("Unknown special Lua JSON type: " .. tostring(type))
    end
    -- Check for standard $ref (only one key: "$ref")
  elseif obj["$ref"] and type(obj["$ref"]) == "string" then
    local key_count = 0
    for _ in pairs(obj) do key_count = key_count + 1 end
    if key_count == 1 then
      table_insert(ref_map.pending, obj)
      table_insert(ref_map.refs, { holder = obj, key_or_index = nil, path = obj["$ref"], ref_obj = obj })
      return obj
    end
  end

  -- If it reached here, it's a regular object
  table_insert(ref_map.pending, obj)

  -- Register metatable if found
  if raw_metatable_value ~= nil then
    table_insert(ref_map.meta_to_set, { target_table = obj, metatable_value = raw_metatable_value })
  end

  return obj
end

-- Main recursive decoding function
decode_value = function(ref_map)
  skip_whitespace()
  if json_pos > json_len then parse_error("Unexpected end of input") end

  local c = string_sub(json_str, json_pos, json_pos)

  if c == '"' then
    return parse_string()
  elseif c == '[' then
    return parse_array(ref_map)
  elseif c == '{' then
    -- parse_object now handles special types and $ref detection internally
    return parse_object(ref_map)
  elseif c == '-' or (c >= '0' and c <= '9') then
    return parse_number()
  elseif c == 't' then
    return parse_literal("true", true)
  elseif c == 'f' then
    return parse_literal("false", false)
  elseif c == 'n' then
    return parse_literal("null", nil) -- Use explicit nil for clarity
  else
    parse_error("Unexpected character '" .. c .. "'")
  end
end


-- Function to resolve $ref paths after initial parsing
local function resolve_refs(root, ref_map)
  local function resolve_path(current_obj, path_str)
    if path_str == "$" then return root end

    -- Basic path parser: $[key1][index2]["key3"]
    local current = root
    -- Use % escape for Lua patterns: match '[', capture non-']' chars, match ']'
    for segment in string_gmatch(path_str, "%[([^%]]+)%]") do
      -- Try to interpret as number first
      local index = tonumber(segment)
      if index then
        if type(current) ~= "table" or not current[index] then
          error("Cannot resolve path '" .. path_str .. "': Invalid index '" .. segment .. "'")
        end
        current = current[index]
      else
        -- Interpret as string key (remove quotes if present)
        local key_str = segment
        if string_sub(key_str, 1, 1) == '"' and string_sub(key_str, -1, -1) == '"' then
          -- Use % escape for Lua patterns: match '\\' followed by any char
          key_str = string_gsub(string_sub(key_str, 2, -2), "%\\(.)", "%1")
        end

        -- Decode the key string (which might be prefixed or just a string/number)
        local key = decode_key_string(key_str)

        if type(current) ~= "table" or current[key] == nil then -- Check for nil explicitly
          error("Cannot resolve path '" .. path_str .. "': Invalid key '" .. tostring(key) .. "'")
        end
        current = current[key]
      end
    end
    return current
  end


  local visited_for_resolve = {}
  setmetatable(visited_for_resolve, { __mode = "k" }) -- Use weak keys

  local function walk_and_resolve_refined(container, key_or_idx)
    -- Prevent infinite loops on cyclic structures already visited
    if type(container) == "table" and visited_for_resolve[container] then return end

    local current_val
    local container_type = type(container)

    if container_type == "table" then
      current_val = container[key_or_idx]
      -- Mark the container as visited *before* processing children
      visited_for_resolve[container] = true
    else
      -- Should not happen if called correctly, but safeguard
      return
    end

    local value_type = type(current_val)

    if value_type == "table" then
      -- Check if the *current value* is a $ref object placeholder
      local ref_path = current_val["$ref"]

      -- Check for the marker added during encoding as well
      local is_ref_obj = ref_path and type(ref_path) == "string" and current_val[LUA_TYPE_MARKER] == true

      if is_ref_obj then
        local success, target = pcall(resolve_path, root, ref_path)
        if not success then
          error("Failed to resolve $ref path '" .. ref_path .. "': " .. target)
        end
        container[key_or_idx] = target -- Replace the $ref object in its container

        -- If the target itself is a table, we might need to resolve refs within it later
        -- But don't recurse immediately to avoid issues with complex cycle resolution order.
        -- The outer loop structure should eventually cover it.
      else
        -- If it's not a $ref object, recurse into its children
        -- Avoid resolving already visited tables
        if not visited_for_resolve[current_val] then
          for k, v in pairs(current_val) do
            walk_and_resolve_refined(current_val, k)
          end
        end
      end
    end
  end

  -- Start the walk from the root object itself if it's a table
  if type(root) == "table" then
    -- Need to handle the case where root itself might be a $ref placeholder
    -- This check might need adjustment depending on exact encoding of root refs
    local root_ref_path = root["$ref"]
    if root_ref_path and type(root_ref_path) == "string" and root[LUA_TYPE_MARKER] == true then
      -- Check if it's the ONLY key
      local key_count = 0
      for _ in pairs(root) do key_count = key_count + 1 end
      if key_count == 1 then
        error("Root object cannot be only a $ref placeholder after initial parse.")
      end
    end

    -- Iterate through root's children to start the resolution
    for k, v in pairs(root) do
      walk_and_resolve_refined(root, k)
    end
  end

  -- Final step: Set metatables now that all references should be resolved
  for _, task in ipairs(ref_map.meta_to_set) do
    local target_table = task.target_table
    local metatable_value = task.metatable_value
    -- The metatable_value itself might have been a $ref, but should be resolved now.
    -- We might need to double check if it points to a placeholder that wasn't resolved?
    -- But the main walk should have handled that.

    -- Check if metatable_value is *still* a $ref placeholder (shouldn't happen if walk worked)
    if type(metatable_value) == "table" and metatable_value["$ref"] and type(metatable_value["$ref"]) == "string" then
      -- Attempt one final resolution pass on this specific metatable value
      local final_mt_val = resolve_path(root, metatable_value["$ref"])
      if type(final_mt_val) == "table" and final_mt_val["$ref"] then
        error("Could not resolve metatable reference: " .. metatable_value["$ref"])
      end
      setmetatable(target_table, final_mt_val)
    else
      setmetatable(target_table, metatable_value)
    end
  end
end


--- Decodes a JSON string into a Lua value.
-- Handles circular references encoded with `{$ref: PATH}`.
-- Handles special types for non-finite numbers (revived correctly).
-- Handles markers for unsupported types like function/userdata (revived as nil).
-- Handles complex keys encoded with `__lua_json_key:` prefix.
-- Handles metatables encoded with `__lua_json_metatable` key (functions inside become nil).
-- Preserves table key order based on `__lua_json_key_order` (for Factorio Lua `pairs` compatibility).
-- @param str The JSON string to decode.
-- @return The decoded Lua value or throws an error.
function json.decode(str)
  if type(str) ~= "string" then
    error("Input must be a string")
  end

  json_str = str
  json_pos = 1
  json_len = #str

  local ref_map = {
    pending = {},                                 -- List of tables/arrays created during parsing
    refs = {},                                    -- List of { holder, key_or_index, path, ref_obj } to resolve later
    visited = {},                                 -- Used during resolution walk { [table] = true }
    meta_to_set = {}                              -- List of { target_table, metatable_value } tasks
  }
  setmetatable(ref_map.visited, { __mode = "k" }) -- Weak keys

  local success, result = pcall(function()
    local value = decode_value(ref_map)
    skip_whitespace()
    if json_pos <= json_len then
      parse_error("Unexpected characters after JSON value")
    end
    resolve_refs(value, ref_map) -- Resolve $refs and set metatables
    return value
  end)

  -- Clean up globals
  json_str = nil
  json_pos = nil
  json_len = nil
  -- ref_map is local and garbage collected

  if not success then
    error("JSON decoding failed: " .. result)
  end

  return result
end

return json
