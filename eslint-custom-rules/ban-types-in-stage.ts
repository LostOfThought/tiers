import path from 'node:path';

import { ESLintUtils } from '@typescript-eslint/utils';

import type { TSESTree } from '@typescript-eslint/utils';
import type { ESLint } from 'eslint';
import type { ReadonlyDeep } from 'type-fest';
import type ts from 'typescript';

type BanTypesOptions = ReadonlyDeep<{
  bannedPaths: ReadonlyArray<string>;
  currentStage: string;
}>;

/**
 * Creates a rule creator function.
 *
 * @param name - The rule name.
 * @returns The URL for the rule documentation.
 * @example
 * const createRule = ESLintUtils.RuleCreator(createRuleUrl);
 */
const createRuleUrl = (name: string): string => `https://example.com/rule/${name}`;

const createRule = ESLintUtils.RuleCreator(createRuleUrl);

/**
 * ESLint rule to ban types/values from specific stages.
 */
const banTypesInStageRule = createRule<[BanTypesOptions], 'bannedInStage'>({
  create: (context, [{ bannedPaths, currentStage }]) => {
    return bannedPaths.length === 0
      ? {}
      : (() => {
          const parserServices = ESLintUtils.getParserServices(context);
          const checker = parserServices.program.getTypeChecker();

          return {
            /**
             * Checks identifiers for banned types.
             *
             * @param node - The identifier node to check.
             * @returns Nothing.
             * @example
             * // This would trigger the rule if DataStage is from a banned path
             * import { DataStage } from 'typed-factorio/data';
             */
            Identifier: (node: TSESTree.Identifier): void => {
              const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
              const symbol: ts.Symbol | undefined = checker.getSymbolAtLocation(tsNode);

              return symbol?.declarations
                ? (() => {
                    const matchedBannedPath = symbol.declarations
                      .map((declaration: ts.Declaration) => {
                        const sourceFileName = declaration.getSourceFile().fileName;

                        return bannedPaths.find((bannedPath: string) =>
                          sourceFileName.includes(bannedPath.replaceAll('/', path.sep)),
                        );
                      })
                      .find((pathFound: string | undefined) => pathFound !== undefined);

                    return matchedBannedPath
                      ? (() => {
                          context.report({
                            data: {
                              bannedPath: matchedBannedPath,
                              name: node.name,
                              stageName: currentStage,
                            },
                            messageId: 'bannedInStage',
                            node,
                          });

                          return;
                        })()
                      : undefined;
                  })()
                : undefined;
            },
          };
        })();
  },
  defaultOptions: [
    {
      bannedPaths: [],
      currentStage: 'unknown',
    },
  ],
  meta: {
    docs: {
      description:
        'Disallow using types/values that are defined in specific files for a given stage.',
    },
    messages: {
      bannedInStage:
        "'{{name}}' is unavailable in the '{{stageName}}' stage. It is defined in a file from '{{bannedPath}}'.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          bannedPaths: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          currentStage: {
            type: 'string',
          },
        },
        required: ['bannedPaths', 'currentStage'],
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'ban-types-in-stage',
});

/**
 * ESLint plugin containing the ban-types-in-stage rule.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Plugin type compatibility
const banTypesInStagePlugin: ESLint.Plugin = {
  rules: {
    // @ts-expect-error -- Plugin type compatibility
    'ban-types-in-stage': banTypesInStageRule,
  },
};

export default banTypesInStagePlugin;