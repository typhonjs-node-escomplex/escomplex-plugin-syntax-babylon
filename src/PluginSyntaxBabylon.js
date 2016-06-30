'use strict';

import PluginSyntaxESTree     from 'escomplex-plugin-syntax-estree/src/PluginSyntaxESTree';

import actualize              from 'typhonjs-escomplex-commons/src/module/traits/actualize';
import safeName               from 'typhonjs-escomplex-commons/src/module/traits/safeName';

/**
 * Provides an typhonjs-escomplex-module / ESComplexModule plugin which loads syntax definitions for trait resolution
 * for unique Babylon AST not found in ESTree.
 *
 * @see https://www.npmjs.com/package/typhonjs-escomplex-module
 */
export default class PluginSyntaxBabylon extends PluginSyntaxESTree
{
   // Unique Babylon AST nodes --------------------------------------------------------------------------------------

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#bindexpression
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   BindExpression() { return actualize(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#booleanliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   BooleanLiteral() { return actualize(0, 0, undefined, (node) => { return node.value; }); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#classmethod
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   ClassMethod()
   {
      return actualize(0, 0, (node) =>
       {
          const operators = ['function'];
          if (node.kind && (node.kind === 'get' || node.kind === 'set')) { operators.push(node.kind); }
          if (typeof node.static === 'boolean' && node.static) { operators.push('static'); }
          return operators;
       },
       (node) => { return safeName(node.key); },
       'key',   // Note: must skip key as the assigned name is forwarded on to FunctionExpression.
       'method'
      );
   }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#decorator
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   Decorator() { return actualize(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#directive
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   Directive() { return actualize(1, 0); }

   /**
    * Avoid conflicts between string literals and identifiers.
    *
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#directiveliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   DirectiveLiteral()
   {
      return actualize(0, 0, undefined, (node) =>
       {
          return typeof node.value === 'string' ? `"${node.value}"` : node.value;
       }
      );
   }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#nullliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   NullLiteral() { return actualize(0, 0, undefined, 'null'); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#numericliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   NumericLiteral() { return actualize(0, 0, undefined, (node) => { return node.value; }); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#objectmethod
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   ObjectMethod()
   {
      return actualize(0, 0, (node) =>
       {
          return typeof node.kind === 'string' && (node.kind === 'get' || node.kind === 'set') ?
           node.kind : undefined;
       },
       undefined,
       'key'  // Note: must skip key as the assigned name is forwarded on to FunctionExpression.
      );
   }

   /**
    * Note: that w/ ES6+ `:` may be omitted and the Property node defines `shorthand` to indicate this case.
    *
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#objectproperty
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   ObjectProperty()
   {
      return actualize(1, 0, (node) =>
       {
          return typeof node.shorthand === 'undefined' ? ':' :
           typeof node.shorthand === 'boolean' && !node.shorthand ? ':' : undefined;
       }
      );
   }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#restproperty
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   RestProperty() { return actualize(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#spreadproperty
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   SpreadProperty() { return actualize(0, 0); }

   /**
    * Avoid conflicts between string literals and identifiers.
    *
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#stringliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   StringLiteral() { return actualize(0, 0, undefined, (node) => { return `"${node.value}"`; }); }
}
