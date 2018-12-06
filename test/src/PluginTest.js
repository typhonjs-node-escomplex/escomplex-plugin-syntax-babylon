import { assert }          from 'chai';

// import fs                  from 'fs';
// import sortObj             from 'sort-object';
// import ASTWalker           from 'typhonjs-ast-walker/src/ASTWalker';

import PluginSyntaxBabylon from '../../src/PluginSyntaxBabylon';

const pluginData =
[
   { name: 'ESM', PluginClass: PluginSyntaxBabylon }
];

pluginData.forEach((plugin) =>
{
   suite(`(${plugin.name}) plugin:`, () =>
   {
      suite('initialize:', () =>
      {
         const instance = new plugin.PluginClass();

         test('plugin was object', () =>
         {
            assert.isObject(instance);
         });

         test('plugin function is exported', () =>
         {
            assert.isFunction(instance.onLoadSyntax);
         });
      });

      suite('method invocation:', () =>
      {
         const instance = new plugin.PluginClass();

         test('plugin throws on empty event data', () =>
         {
            assert.throws(() => { instance.onLoadSyntax(); });
         });

         test('plugin does not throw on proper event data', () =>
         {
            // Sets default configuration data.
            const event = { data: { settings: {}, options: {}, syntaxes: {} } };
            instance.onConfigure(event);

            assert.doesNotThrow(() => { instance.onLoadSyntax(event); });
         });

         test('plugin passes back syntax data', () =>
         {
            // Sets default configuration data.
            const event = { data: { settings: {}, options: {}, syntaxes: {} } };
            instance.onConfigure(event);

            instance.onLoadSyntax(event);
            assert.isObject(event.data.syntaxes);
         });

         test('plugin has correct syntax data length', () =>
         {
            // Sets default configuration data.
            const event = { data: { settings: {}, options: {}, syntaxes: {} } };
            instance.onConfigure(event);

            instance.onLoadSyntax(event);

            // Note: that 60+ definitions are from `escomplex-plugin-syntax-estree`.
            assert.strictEqual(Object.keys(event.data.syntaxes).length, 77);
         });

         test('plugin has correct syntax properties', () =>
         {
            // Sets default configuration data.
            const event = { data: { settings: {}, options: {}, syntaxes: {} } };
            instance.onConfigure(event);

            instance.onLoadSyntax(event);

            for (const type in event.data.syntaxes)
            {
               assert.strictEqual(JSON.stringify(Object.keys(event.data.syntaxes[type])),
                '["lloc","cyclomatic","operators","operands","ignoreKeys","newScope","dependencies"]');
            }
         });
      });

      // TODO: Test needs to be updated and verified.
      // suite('AST Walker:', () =>
      // {
      //    const instance = new plugin.PluginClass();
      //    const verifyResult = JSON.stringify(JSON.parse(fs.readFileSync('./test/fixture/estree-results.json', 'utf8')));
      //
      //    test('verify espree results', () =>
      //    {
      //       const results = {};
      //
      //       // Sets default configuration data.
      //       const event = { data: { settings: {}, options: {}, syntaxes: {} } };
      //       instance.onConfigure(event);
      //
      //       instance.onLoadSyntax(event);
      //
      //       new ASTWalker().traverse(JSON.parse(fs.readFileSync('./test/fixture/espree-estree.json', 'utf8')),
      //       {
      //          enterNode: (node, parent) =>
      //          {
      //             const syntax = event.data.syntaxes[node.type];
      //
      //             if (syntax !== null && typeof syntax === 'object')
      //             {
      //                if (typeof results[node.type] === 'undefined') { results[node.type] = {}; }
      //
      //                for (const metric in syntax)
      //                {
      //                   if (typeof results[node.type][metric] === 'undefined') { results[node.type][metric] = {}; }
      //
      //                   const value = syntax[metric].valueOf(node, parent);
      //
      //                   const valueKey = JSON.stringify(value);
      //
      //                   if (typeof results[node.type][metric][valueKey] === 'undefined')
      //                   {
      //                      results[node.type][metric][valueKey] = 1;
      //                   }
      //                   else
      //                   {
      //                      results[node.type][metric][valueKey]++;
      //                   }
      //                }
      //
      //                return syntax.ignoreKeys.valueOf();
      //             }
      //          }
      //       });
      //
      //       assert.strictEqual(verifyResult, JSON.stringify(sortObj(results)));
      //    });
      // });
   });
});