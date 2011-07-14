// See license.txt for license

if (navigator.language == "cs") {

var blocksDefinition = [
  { name: "control",
    color: "#9C7C7C",
    blocks: [
      {
        name: "prim_runonce",
        type: "h",
        label: "@playIcon",
        color: "#d5c9be",
      }, {
        name: "prim_if",
        type: "c",
        label: "když %b",
        color: "#8D8C00",
      }, {
        name: "prim_if_else",
        type: "e",
        label: "když %b",
        color: "#8D8C00",
      }, {
        name: "prim_while",
        type: "c",
        label: "dokud %b",
        color: "#D77922",
      }, {
        name: "prim_step",
        type: " ",
        label: "krok",
        color: "#31AD00", 
      }, {
        name: "prim_turnleft",
        type: " ",
        label: "vlevo&nbsp;vbok",
        color: "#31AD00",
      }, {
        name: "prim_put",
        type: " ",
        label: "polož",
        color: "#AD0092", 
      }, {
        name: "prim_pick",
        type: " ",
        label: "zvedni",
        color: "#AD0092", 
      }, {
        name: "prim_iswall",
        type: "b",
        label: "zeď",
        color: "#0200C9", 
        
      }, {
        name: "prim_ismark",
        type: "b",
        label: "značka",
        color: "#0200C9", 
      }, {
        name: "prim_ishome",
        type: "b",
        label: "domov",
        color: "#0200C9", 
      }, {
        name: "prim_not",
        type: "b",
        label: "není %b",
        color: "#C9004F", 
      }, {
        name: "prim_stop",
        type: " ",
        label: "konec",
        color: "#000000", 
      }]},
  {
    name: "directions",
    color: "#0C6E96",
    blocks: [
      {
        name: "prim_iseast",
        type: "b",
        label: "východ",
      }, {
        name: "prim_isnorth",
        type: "b",
        label: "sever",
      }, {
        name: "prim_iswest",
        type: "b",
        label: "západ",
      }, {
        name: "prim_issouth",
        type: "b",
        label: "jih",
      }]}, 
  {
    name: "custom",
    color: "#9C5C5A",
    blocks: [{
      name: "prim_proceduredef",
      type: "h",
      label: "nová funkce",
      varOrProcName: "nová funkce",
    }]}]
    
} else {
  
var blocksDefinition = [
{ name: "control",
color: "#9C7C7C",
blocks: [
{
  name: "prim_runonce",
  type: "h",
  label: "@playIcon",
  color: "#d5c9be",
}, {
  name: "prim_if",
  type: "c",
  label: "if %b",
  color: "#8D8C00",
}, {
  name: "prim_if_else",
  type: "e",
  label: "if %b",
  color: "#8D8C00",
}, {
  name: "prim_while",
  type: "c",
  label: "while %b",
  color: "#D77922",
}, {
  name: "prim_step",
  type: " ",
  label: "step",
  color: "#31AD00", 
}, {
  name: "prim_turnleft",
  type: " ",
  label: "turn&nbsp;left",
  color: "#31AD00",
}, {
  name: "prim_put",
  type: " ",
  label: "put",
  color: "#AD0092", 
}, {
  name: "prim_pick",
  type: " ",
  label: "pick",
  color: "#AD0092", 
}, {
  name: "prim_iswall",
  type: "b",
  label: "wall",
  color: "#0200C9", 
  
}, {
  name: "prim_ismark",
  type: "b",
  label: "mark",
  color: "#0200C9", 
}, {
  name: "prim_ishome",
  type: "b",
  label: "home",
  color: "#0200C9", 
}, {
  name: "prim_not",
  type: "b",
  label: "not %b",
  color: "#C9004F", 
}, {
  name: "prim_stop",
  type: " ",
  label: "stop",
  color: "#000000", 
}]},
{
  name: "directions",
  color: "#0C6E96",
  blocks: [
  {
    name: "prim_iseast",
    type: "b",
    label: "east",
  }, {
    name: "prim_isnorth",
    type: "b",
    label: "north",
  }, {
    name: "prim_iswest",
    type: "b",
    label: "west",
  }, {
    name: "prim_issouth",
    type: "b",
    label: "south",
  }]}, 
  {
    name: "custom",
    color: "#9C5C5A",
    blocks: [{
      name: "prim_proceduredef",
      type: "h",
      label: "new function",
      varOrProcName: "new function",
    }]}]
}  
