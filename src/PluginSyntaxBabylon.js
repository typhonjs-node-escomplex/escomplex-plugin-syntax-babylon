'use strict';

import actualise              from 'escomplex-core-commons/src/traits/actualise.js';
import safeName               from 'escomplex-core-commons/src/traits/safeName.js';

import PluginSyntaxESTree     from 'escomplex-plugin-syntax-estree/src/PluginSyntaxESTree.js';

/**
 * Provides an ESComplex plugin which loads syntax definitions for trait resolution for unique Babylon AST not
 * found in ESTree.
 */
export default class PluginSyntaxBabylon extends PluginSyntaxESTree
{
   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#bindexpression
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   BindExpression() { return actualise(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#booleanliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   BooleanLiteral() { return actualise(0, 0, undefined, (node) => { return node.value; }); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#classmethod
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   ClassMethod()
   {
      return actualise(0, 0, (node) =>
         {
            const operators = ['function'];
            if (node.kind && (node.kind === 'get' || node.kind === 'set')) { operators.push(node.kind); }
            if (typeof node.static === 'boolean' && node.static) { operators.push('static'); }
            return operators;
         },
         (node) => { return safeName(node.key); },
         'key',   // Note: must skip key as the assigned name is forwarded on to FunctionExpression.
         true
      );
   }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#decorator
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   Decorator() { return actualise(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#directive
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   Directive() { return actualise(1, 0); }

   /**
    * Avoid conflicts between string literals and identifiers.
    *
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#directiveliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   DirectiveLiteral()
   {
      return actualise(0, 0, undefined, (node) =>
         {
            return typeof node.value === 'string' ? `"${node.value}"` : node.value;
         }
      );
   }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#nullliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   NullLiteral() { return actualise(0, 0, undefined, 'null'); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#numericliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   NumericLiteral() { return actualise(0, 0, undefined, (node) => { return node.value; }); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#objectmethod
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   ObjectMethod()
   {
      return actualise(0, 0, (node) =>
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
      return actualise(1, 0, (node) =>
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
   RestProperty() { return actualise(0, 0); }

   /**
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#spreadproperty
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   SpreadProperty() { return actualise(0, 0); }

   /**
    * Avoid conflicts between string literals and identifiers.
    *
    * @see https://github.com/babel/babel/blob/master/doc/ast/spec.md#stringliteral
    * @returns {{lloc: *, cyclomatic: *, operators: *, operands: *, ignoreKeys: *, newScope: *, dependencies: *}}
    */
   StringLiteral() { return actualise(0, 0, undefined, (node) => { return `"${node.value}"`; }); }
}