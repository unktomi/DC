// Parser for Hagino-style data/codata declarations
const grammar = `
Program = _ decl:Declaration _ { return decl; }

Declaration 
  = "data" _ typename:TypeName _ param:TypeParam _ "with" _ fold:VarName _ "is" _
    "nil" _ ":" _ "()" _ "->" _ rettype1:TypeName _ retparam1:TypeParam _
    "cons" _ ":" _ param2:TypeParam _ "×" _ rettype2:TypeName _ retparam2:TypeParam _ "->" _ rettype3:TypeName _ retparam3:TypeParam _
    "end"
    { return {
        type: "data", 
        name: typename, 
        param,
        fold,
        constructors: [
          {name: "nil", sig: {domain: {type: "unit"}, codomain: {type: "app", name: rettype1, params: [retparam1]}}},
          {name: "cons", sig: {
            domain: {type: "product", left: param2, right: {type: "app", name: rettype2, params: [retparam2]}},
            codomain: {type: "app", name: rettype3, params: [retparam3]}
          }}
        ]
      }; }

TypeName = first:[A-Z] rest:[a-zA-Z0-9]* { return first + rest.join(""); }
TypeParam = [a-z] { return text(); }
VarName = chars:[a-z]+ { return chars.join(""); }

_ = [ \\t\\n\\r]*
`;

module.exports = { grammar };