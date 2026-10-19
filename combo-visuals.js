/*
  Combo visual authoring data
  ---------------------------
  Add one entry per combo line using the exact deck-id|combo-title key.
  hand shows the required opener; fieldBefore shows the starting board.
  Each step uses flow (inputs -> action -> outputs) and fieldAfter.
  Use card("Official Card Name") for a real card image and group("A clear label")
  for a generic card/choice. Add optional frame, type, level, scale, and requirements details; generic cards use blank type-appropriate frames and open a requirements preview.
  Zone keys: emzLeft, emzRight, banished, field, monster1-5, grave, extra,
  spell1-5, main. Optional opponentBefore / step.opponentAfter show the other field.
*/
(function () {
  const card = (name, qty) => ({ card: name, qty: qty || 1 });
  const group = (label, qty, details) => {
    const text = String(label).toLowerCase();
    const frame = text.includes("pendulum") ? "pendulum" : text.includes("fusion monster") ? "fusion" : text.includes("synchro") ? "synchro" : text.includes("xyz") ? "xyz" : text.includes("link") ? "link" : text.includes("spell") ? "spell" : text.includes("trap") ? "trap" : text.includes("monster") ? "monster" : "any";
    const type = frame === "pendulum" ? "Pendulum Monster" : frame === "spell" ? "Spell Card" : frame === "trap" ? "Trap Card" : frame === "fusion" ? "Fusion Monster" : frame === "synchro" ? "Synchro Monster" : frame === "xyz" ? "Xyz Monster" : frame === "link" ? "Link Monster" : frame === "monster" ? "Monster" : "Any card";
    const inferred = {label, qty: qty || 1, frame, type};
    if (!details && frame === "any" && /discard|any card/i.test(label)) inferred.requirements = "Any card in your hand can be used for this discard.";
    return Object.assign(inferred, details || {});
  };
  const zone = (name, materials) => ({ card: name, materials: materials || [] });
  const step = (inputs, action, outputs, fieldAfter, opponentAfter) => {
    const item = { flow: { inputs, action, outputs }, fieldAfter };
    if (opponentAfter) item.opponentAfter = opponentAfter;
    return item;
  };

  window.comboVisuals = {
    "odd-eyes|Two scales into Odd-Eyes Absolute Dragon": {
      hand: [card("Odd-Eyes Persona Dragon"), card("Odd-Eyes Mirage Dragon"), card("Odd-Eyes Arc Pendulum Dragon", 2)],
      fieldBefore: {},
      steps: [
        step(
          [card("Odd-Eyes Persona Dragon"), card("Odd-Eyes Mirage Dragon")],
          "ACTIVATE BOTH PENDULUM SCALES",
          [card("Odd-Eyes Persona Dragon"), card("Odd-Eyes Mirage Dragon")],
          { spell1: zone("Odd-Eyes Persona Dragon"), spell5: zone("Odd-Eyes Mirage Dragon") }
        ),
        step(
          [card("Odd-Eyes Arc Pendulum Dragon", 2)],
          "PENDULUM SUMMON",
          [card("Odd-Eyes Arc Pendulum Dragon", 2)],
          { spell1: zone("Odd-Eyes Persona Dragon"), spell5: zone("Odd-Eyes Mirage Dragon"), monster2: zone("Odd-Eyes Arc Pendulum Dragon"), monster4: zone("Odd-Eyes Arc Pendulum Dragon") }
        ),
        step(
          [card("Odd-Eyes Arc Pendulum Dragon", 2)],
          "XYZ SUMMON",
          [card("Odd-Eyes Absolute Dragon")],
          { spell1: zone("Odd-Eyes Persona Dragon"), spell5: zone("Odd-Eyes Mirage Dragon"), monster3: zone("Odd-Eyes Absolute Dragon", ["Odd-Eyes Arc Pendulum Dragon", "Odd-Eyes Arc Pendulum Dragon"]) }
        )
      ]
    },

    "odd-eyes|Build with an extra Pendulum Summon": {
      hand: [group("Discard card", 1, { type: "Any card", frame: "any", requirements: "Any card in your hand can be discarded to activate Odd-Eyes Override Dragon’s Quick Effect." })],
      fieldBefore: { monster2: group("Other Link Material", 1, { type: "Monster", frame: "monster", requirements: "Use enough Link Material to make Link-3 Odd-Eyes Override Dragon; include at least 2 monsters total and a Pendulum Monster." }), monster3: group("Pendulum Monster used as Link Material", 1, { frame: "pendulum", type: "Pendulum Monster", requirements: "Use this as one of at least 2 monsters for Odd-Eyes Override Dragon’s Link-3 Summon." }), spell1: group("Pendulum card to destroy", 1, { frame: "pendulum", type: "Pendulum Monster Card", requirements: "A Pendulum Monster Card you control that can be destroyed by Odd-Eyes Override Dragon’s effect." }) },
      steps: [
        step(
          [group("Link-3 material total", 1, { type: "Monster", frame: "monster", requirements: "At least 2 monsters whose Link ratings total 3, including at least 1 Pendulum Monster." })],
          "LINK SUMMON",
          [card("Odd-Eyes Override Dragon")],
          { monster3: zone("Odd-Eyes Override Dragon"), spell1: group("Pendulum card available to destroy", 1, { frame: "pendulum", type: "Pendulum Monster Card" }), extra: group("Pendulum Link Material face-up") }
        ),
        step(
          [card("Odd-Eyes Override Dragon"), group("Pendulum Monster Card in your Spell / Trap Zone", 1, { frame: "pendulum", type: "Pendulum Monster Card" })],
          "DESTROY / DRAW / GAIN A PENDULUM SUMMON",
          [group("Additional Pendulum Summon granted")],
          { monster3: zone("Odd-Eyes Override Dragon"), extra: group("Pendulum Link Material and destroyed Pendulum card face-up") }
        ),
        step(
          [group("Performapal / Magician / Odd-Eyes monsters")],
          "USE THE ADDITIONAL PENDULUM SUMMON",
          [group("Pendulum Summoned monsters")],
          { monster2: group("Pendulum Summoned monster"), monster3: zone("Odd-Eyes Override Dragon"), monster4: group("Pendulum Summoned monster"), extra: group("Face-up Pendulum cards") }
        ),
        step(
          [card("Odd-Eyes Override Dragon"), group("Discard card", 1, { type: "Any card", frame: "any", requirements: "Discard any card from your hand when your opponent activates a card or effect during your turn." })],
          "QUICK EFFECT / NEGATE",
          [group("Opponent's activation negated")],
          { monster2: group("Pendulum Summoned monster"), monster3: zone("Odd-Eyes Override Dragon"), monster4: group("Pendulum Summoned monster"), extra: group("Face-up Pendulum cards") }
        )
      ]
    },

    "odd-eyes|Make Odd-Eyes Vortex Dragon": {
      hand: [group("Low Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6", requirements: "Use a scale of 6 or lower. Paired with a scale of 9 or higher, this allows you to Pendulum Summon Levels 7 and 8." }), group("High Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9", requirements: "Use a scale of 9 or higher. Paired with a scale of 6 or lower, this allows you to Pendulum Summon Levels 7 and 8." }), card("Performapal Odd-Eyes Dissolver"), card("Odd-Eyes Arc Pendulum Dragon")],
      fieldBefore: {},
      steps: [
        step(
          [group("Pendulum Scale ≤ 6", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6" }), group("Pendulum Scale ≥ 9", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9" })],
          "ACTIVATE PENDULUM SCALES",
          [group("Low Scale in left Pendulum Zone", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6", requirements: "Keep this scale at 6 or lower so the pair includes Levels 7 and 8." }), group("High Scale in right Pendulum Zone", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9", requirements: "Keep this scale at 9 or higher so the pair includes Levels 7 and 8." })],
          { spell1: group("Low Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6" }), spell5: group("High Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9" }) }
        ),
        step(
          [card("Performapal Odd-Eyes Dissolver"), card("Odd-Eyes Arc Pendulum Dragon")],
          "PENDULUM SUMMON",
          [card("Performapal Odd-Eyes Dissolver"), card("Odd-Eyes Arc Pendulum Dragon")],
          { spell1: group("Low Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6" }), spell5: group("High Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9" }), monster2: zone("Performapal Odd-Eyes Dissolver"), monster4: zone("Odd-Eyes Arc Pendulum Dragon") }
        ),
        step(
          [card("Performapal Odd-Eyes Dissolver"), card("Odd-Eyes Arc Pendulum Dragon")],
          "FUSION SUMMON",
          [card("Odd-Eyes Vortex Dragon")],
          { spell1: group("Low Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≤ 6" }), spell5: group("High Pendulum Scale", 1, { frame: "pendulum", type: "Pendulum Scale", scale: "≥ 9" }), monster3: zone("Odd-Eyes Vortex Dragon"), extra: group("Dissolver and Odd-Eyes Arc Pendulum Dragon face-up") }
        )
      ]
    },

    "lunalight|Gold Leo: one-card route to two Liger Dancers": {
      hand: [card("Lunalight Gold Leo")],
      fieldBefore: {},
      steps: [
        step(
          [card("Lunalight Gold Leo")],
          "NORMAL SUMMON / SEARCH / DISCARD",
          [card("Lunalight Gold Leo"), card("Lunalight Masquerade"), card("Lunalight Yellow Marten")],
          { monster3: zone("Lunalight Gold Leo"), grave: card("Lunalight Yellow Marten") }
        ),
        step(
          [card("Lunalight Masquerade"), card("Lunalight Silver Hound"), card("Lunalight Yellow Marten")],
          "SILVER HOUND / YELLOW MARTEN EFFECTS / SPECIAL SUMMON",
          [card("Lunalight Kaleido Chick"), card("Lunalight Yellow Marten"), card("Lunalight Tiger")],
          { monster2: zone("Lunalight Yellow Marten"), monster3: zone("Lunalight Gold Leo"), grave: group("Lunalight Silver Hound") }
        ),
        step(
          [card("Lunalight Yellow Marten"), card("Lunalight Gold Leo")],
          "XYZ SUMMON / SEARCH",
          [card("Brotherhood of the Fire Fist - Tiger King"), card("Fire Formation - Tenki"), card("Lunalight Black Sheep"), card("Lunalight Kaleido Chick")],
          { monster3: zone("Brotherhood of the Fire Fist - Tiger King", ["Lunalight Yellow Marten", "Lunalight Gold Leo"]), spell3: zone("Fire Formation - Tenki") }
        ),
        step(
          [card("Lunalight Tiger")],
          "TIGER PENDULUM EFFECT / SPECIAL SUMMON FROM GY",
          [card("Lunalight Black Sheep")],
          { monster2: zone("Lunalight Black Sheep"), monster3: zone("Brotherhood of the Fire Fist - Tiger King"), spell3: zone("Fire Formation - Tenki"), spell1: zone("Lunalight Tiger") }
        ),
        step(
          [card("Polymerization"), card("Lunalight Kaleido Chick"), card("Lunalight Black Sheep")],
          "FUSION SUMMON",
          [card("Lunalight Perfume Dancer")],
          { monster2: zone("Lunalight Perfume Dancer"), monster3: zone("Brotherhood of the Fire Fist - Tiger King"), spell3: zone("Fire Formation - Tenki"), spell1: zone("Lunalight Tiger") }
        ),
        step(
          [card("Lunalight Wolf"), group("Materials for Wolf’s Pendulum Fusion Effect")],
          "WOLF PENDULUM EFFECT / FUSION SUMMON",
          [card("Lunalight Liger Dancer")],
          { monster2: zone("Cross-Sheep"), monster3: zone("S:P Little Knight"), monster4: zone("Lunalight Liger Dancer"), monster5: zone("Lunalight Liger Dancer"), spell1: zone("Lunalight Tiger"), spell5: zone("Lunalight Wolf") }
        )
      ]
    },

    "lunalight|Going second: Lunalight Fusion into Liger Dancer": {
      hand: [card("Lunalight Fusion"), group("Lunalight monster", 2, { type: "Lunalight Monster", frame: "monster", requirements: "Two Lunalight monsters. Their availability in hand / field must satisfy the Fusion line described." })],
      fieldBefore: {},
      opponentBefore: { monster3: group("Opponent's Extra Deck monster") },
      steps: [
        step(
          [card("Lunalight Fusion"), group("Two Lunalight monsters from hand / field"), card("Lunalight Leo Dancer"), group("Lunalight monster from Deck")],
          "ACTIVATE / SELECT FUSION MATERIALS",
          [card("Lunalight Leo Dancer"), group("Three Lunalight Fusion Materials")],
          {}
        ),
        step(
          [card("Lunalight Leo Dancer"), group("Three Lunalight Fusion Materials")],
          "FUSION SUMMON",
          [card("Lunalight Liger Dancer")],
          { monster3: zone("Lunalight Liger Dancer"), grave: group("Fusion materials") }
        ),
        step(
          [card("Lunalight Liger Dancer"), group("Lunalight monster from Extra Deck")],
          "QUICK EFFECT / DESTROY",
          [group("Opponent's Special Summoned monsters may be destroyed")],
          { monster3: zone("Lunalight Liger Dancer"), grave: group("Fusion materials") },
          {}
        )
      ]
    },

    "lunalight|Scarlet Tiger turns a Lunalight effect into Polymerization": {
      hand: [card("Lunalight Scarlet Tiger"), group("Other Lunalight monsters", 2, { type: "Lunalight Monster", frame: "monster", requirements: "Two Lunalight monsters. One can be used with Scarlet Tiger as material for an eligible Fusion Monster." })],
      fieldBefore: { monster3: group("Lunalight effect starter", 1, { type: "Lunalight Monster", frame: "monster", requirements: "You control this Lunalight monster and can activate its effect to trigger Scarlet Tiger." }) },
      steps: [
        step(
          [group("Lunalight effect starter")],
          "ACTIVATE MONSTER EFFECT",
          [group("Lunalight effect starter remains on the field")],
          { monster3: group("Lunalight monster") }
        ),
        step(
          [group("Lunalight effect starter")],
          "SCARLET TIGER SPECIAL SUMMON / ADD POLYMERIZATION",
          [card("Lunalight Scarlet Tiger"), card("Polymerization")],
          { monster2: zone("Lunalight Scarlet Tiger"), monster3: group("Lunalight effect starter", 1, { type: "Lunalight Monster", frame: "monster", requirements: "The same Lunalight effect starter remains in this zone." }) }
        ),
        step(
          [card("Polymerization"), card("Lunalight Scarlet Tiger"), group("Lunalight monster")],
          "FUSION SUMMON",
          [group("Eligible Lunalight Fusion Monster")],
          { monster2: group("Eligible Lunalight Fusion Monster"), monster3: group("Lunalight effect starter", 1, { type: "Lunalight Monster", frame: "monster", requirements: "The same Lunalight effect starter remains in this zone." }), grave: group("Fusion materials") }
        )
      ]
    },

    "speedroid|Terrortop alone into a Level 7 Clear Wing": {
      hand: [card("Speedroid Terrortop")],
      fieldBefore: {},
      steps: [
        step(
          [card("Speedroid Terrortop")],
          "SPECIAL SUMMON / SEARCH",
          [card("Speedroid Terrortop"), card("Speedroid Marble Machine")],
          { monster3: zone("Speedroid Terrortop") }
        ),
        step(
          [card("Speedroid Marble Machine"), card("Speedroid Taketomborg")],
          "NORMAL SUMMON / SEARCH / SPECIAL SUMMON",
          [card("Speedroid Taketomborg")],
          { monster2: zone("Speedroid Marble Machine"), monster3: zone("Speedroid Terrortop"), monster4: zone("Speedroid Taketomborg") }
        ),
        step(
          [card("Speedroid Taketomborg")],
          "TRIBUTE / SPECIAL SUMMON",
          [card("Speedroid Red-Eyed Dice")],
          { monster2: zone("Speedroid Marble Machine"), monster3: zone("Speedroid Terrortop"), monster4: zone("Speedroid Red-Eyed Dice"), grave: card("Speedroid Taketomborg") }
        ),
        step(
          [card("Speedroid Red-Eyed Dice"), card("Speedroid Terrortop")],
          "DICE EFFECT / CHANGE TERRORTOP TO LEVEL 6",
          [group("Speedroid Terrortop at Level 6", 1, { type: "WIND Machine Monster", frame: "monster", level: "LEVEL 6", requirements: "Speedroid Red-Eyed Dice changed the Level of the exact Terrortop card already on your field to 6." })],
          { monster2: zone("Speedroid Marble Machine"), monster3: zone("Speedroid Terrortop"), monster4: zone("Speedroid Red-Eyed Dice"), grave: card("Speedroid Taketomborg") }
        ),
        step(
          [card("Speedroid Red-Eyed Dice"), card("Speedroid Terrortop")],
          "SYNCHRO SUMMON",
          [card("Clear Wing Synchro Dragon")],
          { monster2: zone("Speedroid Marble Machine"), monster3: zone("Clear Wing Synchro Dragon"), grave: group("Synchro materials") }
        )
      ]
    },

    "speedroid|Two Pendulum Scales directly make Clear Wing": {
      hand: [card("Speedroid Wing Synchron"), card("Speedroid Marble Machine")],
      fieldBefore: {},
      steps: [
        step(
          [card("Speedroid Wing Synchron"), card("Speedroid Marble Machine")],
          "ACTIVATE PENDULUM SCALES",
          [card("Speedroid Wing Synchron"), card("Speedroid Marble Machine")],
          { spell1: zone("Speedroid Wing Synchron"), spell5: zone("Speedroid Marble Machine") }
        ),
        step(
          [card("Speedroid Wing Synchron"), card("Speedroid Marble Machine")],
          "WING SYNCHRON EFFECT / DESTROY BOTH SCALES / SYNCHRO SUMMON",
          [card("Clear Wing Synchro Dragon"), group("Both Pendulum cards face-up in the Extra Deck")],
          { monster3: zone("Clear Wing Synchro Dragon"), extra: group("Wing Synchron and Marble Machine face-up") }
        )
      ]
    },

    "speedroid|Marble Machine plus Taketomborg into a Synchro": {
      hand: [card("Speedroid Marble Machine"), card("Speedroid Taketomborg")],
      fieldBefore: {},
      steps: [
        step(
          [card("Speedroid Marble Machine")],
          "NORMAL SUMMON / SEARCH",
          [card("Speedroid Marble Machine"), card("Speedroid Red-Eyed Dice")],
          { monster3: zone("Speedroid Marble Machine") }
        ),
        step(
          [card("Speedroid Taketomborg")],
          "SPECIAL SUMMON / TRIBUTE / SPECIAL SUMMON",
          [card("Speedroid Red-Eyed Dice")],
          { monster3: zone("Speedroid Marble Machine"), monster4: zone("Speedroid Red-Eyed Dice"), grave: card("Speedroid Taketomborg") }
        ),
        step(
          [card("Speedroid Red-Eyed Dice"), card("Speedroid Marble Machine")],
          "SYNCHRO SUMMON",
          [card("Hi-Speedroid Chanbara")],
          { monster3: zone("Hi-Speedroid Chanbara"), grave: group("Synchro materials and Taketomborg") }
        )
      ]
    },

    "chronicles|Branded Fusion into Mirrorjade": {
      hand: [card("Branded Fusion"), group("Discard card for Lubellion", 1, { type: "Any card", frame: "any", requirements: "Any card in your hand to discard for Lubellion the Searing Dragon’s Fusion effect." })],
      fieldBefore: {},
      steps: [
        step(
          [card("Branded Fusion"), card("Fallen of Albaz"), card("Despian Tragedy")],
          "FUSION SUMMON",
          [card("Lubellion the Searing Dragon")],
          { monster3: zone("Lubellion the Searing Dragon"), grave: group("Fallen of Albaz and Despian Tragedy") }
        ),
        step(
          [card("Despian Tragedy")],
          "TRIGGER EFFECT / SEARCH",
          [group("Despia monster added to hand")],
          { monster3: zone("Lubellion the Searing Dragon"), grave: group("Despian Tragedy") }
        ),
        step(
          [card("Lubellion the Searing Dragon"), card("Fallen of Albaz"), group("Discard card")],
          "DISCARD / SHUFFLE MATERIALS INTO DECK / FUSION SUMMON",
          [card("Mirrorjade the Iceblade Dragon")],
          { monster3: zone("Mirrorjade the Iceblade Dragon"), grave: group("Discard and remaining materials") }
        ),
        step(
          [card("Mirrorjade the Iceblade Dragon")],
          "FUSION-ONLY EXTRA DECK RESTRICTION",
          [card("Mirrorjade the Iceblade Dragon")],
          { monster3: zone("Mirrorjade the Iceblade Dragon"), grave: group("Discard and remaining materials") }
        )
      ]
    },

    "chronicles|Fallen of Albaz uses an opponent’s LIGHT monster": {
      hand: [card("Fallen of Albaz"), group("Discard card")],
      fieldBefore: {},
      opponentBefore: { monster3: group("Opponent's face-up LIGHT monster") },
      steps: [
        step(
          [card("Fallen of Albaz")],
          "NORMAL OR SPECIAL SUMMON",
          [card("Fallen of Albaz")],
          { monster3: zone("Fallen of Albaz") }
        ),
        step(
          [card("Fallen of Albaz"), group("Discard card")],
          "ACTIVATE ON-SUMMON EFFECT",
          [card("Fallen of Albaz"), group("Discard sent to GY")],
          { monster3: zone("Fallen of Albaz"), grave: group("Discard card") }
        ),
        step(
          [card("Fallen of Albaz"), group("Opponent's LIGHT monster")],
          "FUSION SUMMON",
          [card("Albion the Branded Dragon")],
          { monster3: zone("Albion the Branded Dragon"), grave: group("Fusion materials") },
          {}
        ),
        step(
          [card("Albion the Branded Dragon"), card("Fallen of Albaz")],
          "ALBION EFFECT / BANISH MATERIALS / FUSION SUMMON",
          [card("Mirrorjade the Iceblade Dragon")],
          { monster3: zone("Mirrorjade the Iceblade Dragon") }
        )
      ]
    },

    "chronicles|Nadir Servant sets an Albaz follow-up": {
      hand: [card("Nadir Servant")],
      fieldBefore: {},
      steps: [
        step(
          [card("Nadir Servant"), card("Titaniklad the Ash Dragon")],
          "SEND FROM EXTRA DECK / ADD",
          [card("Titaniklad the Ash Dragon"), group("Dogmatika monster or Fallen of Albaz")],
          { grave: card("Titaniklad the Ash Dragon") }
        ),
        step(
          [card("Titaniklad the Ash Dragon")],
          "EXTRA DECK SPECIAL SUMMON RESTRICTION",
          [group("No Extra Deck summon this turn")],
          { grave: card("Titaniklad the Ash Dragon") }
        ),
        step(
          [card("Titaniklad the Ash Dragon")],
          "END PHASE TRIGGER / ADD OR SPECIAL SUMMON",
          [group("Dogmatika monster or Fallen of Albaz")],
          { grave: card("Titaniklad the Ash Dragon") }
        )
      ]
    }
  };

  // Each entry is the cumulative Graveyard / banished state after a combo step.
  // Keep a snapshot per step so the field diagram can show where every tracked card went.
  const pile = (grave, banished) => ({ grave: grave || [], banished: banished || [] });
  const track = (hand, mainRemoved, extraRemoved, extraFaceUp, mainUnknownRemoved, extraUnknownRemoved) => ({
    hand: hand || [], mainRemoved: mainRemoved || [], extraRemoved: extraRemoved || [], extraFaceUp: extraFaceUp || [],
    mainUnknownRemoved: mainUnknownRemoved || 0, extraUnknownRemoved: extraUnknownRemoved || 0
  });
  const any = (label, requirements) => group(label, 1, { type: "Any card", frame: "any", requirements: requirements || "A card whose exact identity depends on the line; click for the stated requirement." });
  const lunalight = label => group(label, 1, { type: "Lunalight Monster", frame: "monster", requirements: "A Lunalight Monster card; its exact identity depends on the selected line." });
  window.comboPileStates = {
    "odd-eyes|Two scales into Odd-Eyes Absolute Dragon": [pile(), pile(), pile()],
    "odd-eyes|Build with an extra Pendulum Summon": [
      pile([group("Non-Pendulum Link Material", 1, { type: "Monster", frame: "monster", requirements: "The other Link Material; Pendulum Link Materials are placed face-up in the Extra Deck instead." })]),
      pile([group("Non-Pendulum Link Material", 1, { type: "Monster", frame: "monster" })]),
      pile([group("Non-Pendulum Link Material", 1, { type: "Monster", frame: "monster" })]),
      pile([group("Non-Pendulum Link Material", 1, { type: "Monster", frame: "monster" }), any("Discarded card", "Any card discarded to activate Odd-Eyes Override Dragon’s Quick Effect.")])
    ],
    "odd-eyes|Make Odd-Eyes Vortex Dragon": [pile(), pile(), pile()],
    "lunalight|Gold Leo: one-card route to two Liger Dancers": [
      pile([card("Lunalight Yellow Marten")]),
      pile([card("Lunalight Silver Hound")]),
      pile([card("Lunalight Silver Hound")]),
      pile([card("Lunalight Silver Hound")]),
      pile([card("Lunalight Silver Hound"), card("Lunalight Black Sheep")]),
      pile([card("Lunalight Yellow Marten"), card("Lunalight Silver Hound"), card("Brotherhood of the Fire Fist - Tiger King"), card("Lunalight Emerald Bird"), card("Lunalight Kaleido Chick"), card("Lunalight Gold Leo"), card("Polymerization")], [card("Luna Light Perfume"), card("Lunalight Leo Dancer"), card("Lunalight Perfume Dancer"), card("Lunalight Black Sheep"), card("Lunalight Gold Leo")])
    ],
    "lunalight|Going second: Lunalight Fusion into Liger Dancer": [
      pile(),
      pile([card("Lunalight Leo Dancer"), lunalight("Three Lunalight Fusion Materials"), card("Lunalight Fusion")]),
      pile([card("Lunalight Leo Dancer"), lunalight("Three Lunalight Fusion Materials"), card("Lunalight Fusion"), group("Lunalight monster sent from the Extra Deck", 1, { frame: "fusion", type: "Fusion Monster", requirements: "A Lunalight monster sent from your Extra Deck to the GY for Liger Dancer’s effect." })])
    ],
    "lunalight|Scarlet Tiger turns a Lunalight effect into Polymerization": [
      pile(), pile(), pile([card("Lunalight Scarlet Tiger"), lunalight("Two Lunalight Fusion Materials"), card("Polymerization")])
    ],
    "speedroid|Terrortop alone into a Level 7 Clear Wing": [
      pile(), pile(), pile([card("Speedroid Taketomborg")]),
      pile([card("Speedroid Taketomborg")]),
      pile([card("Speedroid Taketomborg"), card("Speedroid Terrortop"), card("Speedroid Red-Eyed Dice")])
    ],
    "speedroid|Two Pendulum Scales directly make Clear Wing": [pile(), pile()],
    "speedroid|Marble Machine plus Taketomborg into a Synchro": [
      pile(), pile([card("Speedroid Taketomborg")]),
      pile([card("Speedroid Taketomborg"), card("Speedroid Marble Machine"), card("Speedroid Red-Eyed Dice")])
    ],
    "chronicles|Branded Fusion into Mirrorjade": [
      pile([card("Fallen of Albaz"), card("Despian Tragedy"), card("Branded Fusion")]),
      pile([card("Fallen of Albaz"), card("Despian Tragedy"), card("Branded Fusion")]),
      pile([card("Despian Tragedy"), card("Branded Fusion"), any("Lubellion discard", "Any card discarded to activate Lubellion the Searing Dragon’s Fusion effect.")]),
      pile([card("Despian Tragedy"), card("Branded Fusion"), any("Lubellion discard", "Any card discarded to activate Lubellion the Searing Dragon’s Fusion effect.")])
    ],
    "chronicles|Fallen of Albaz uses an opponent’s LIGHT monster": [
      pile(),
      pile([any("Discarded card", "One card discarded as the activation cost for Fallen of Albaz’s effect.")]),
      pile([any("Discarded card", "One card discarded as the activation cost for Fallen of Albaz’s effect."), card("Fallen of Albaz"), group("Opponent’s LIGHT monster", 1, { type: "Monster", frame: "monster", requirements: "The face-up LIGHT monster used as Fusion Material; it is sent to its owner’s GY." })]),
      pile([any("Discarded card", "One card discarded as the activation cost for Fallen of Albaz’s effect."), group("Opponent’s LIGHT monster", 1, { type: "Monster", frame: "monster", requirements: "The LIGHT monster used with Fallen of Albaz to Fusion Summon Albion; it remains in the GY." })], [card("Fallen of Albaz"), card("Albion the Branded Dragon")])
    ],
    "chronicles|Nadir Servant sets an Albaz follow-up": [
      pile([card("Titaniklad the Ash Dragon"), card("Nadir Servant")]),
      pile([card("Titaniklad the Ash Dragon"), card("Nadir Servant")]),
      pile([card("Titaniklad the Ash Dragon"), card("Nadir Servant")])
    ]
  };

  // Per-step hand and deck-zone snapshots. mainRemoved / extraRemoved list the
  // named cards currently outside that deck; returned cards are removed from these
  // arrays in later snapshots. Face-up Pendulum cards are ordered with the
  // newest card last so it can serve as the Extra Deck pile icon.
  window.comboZoneStates = {
    "odd-eyes|Two scales into Odd-Eyes Absolute Dragon": [
      track([card("Odd-Eyes Arc Pendulum Dragon",2)]),
      track([]),
      track([], [], [card("Odd-Eyes Absolute Dragon")])
    ],
    "odd-eyes|Build with an extra Pendulum Summon": [
      track([any("Discard card")], [], [card("Odd-Eyes Override Dragon")], [group("Pendulum Link Material face-up",1,{frame:"pendulum",type:"Pendulum Monster",requirements:"A Pendulum Monster used as Link Material; it is face-up in the Extra Deck."})]),
      track([any("Discard card"), any("Card drawn")], [], [card("Odd-Eyes Override Dragon")], [group("Pendulum Link Material face-up",1,{frame:"pendulum",type:"Pendulum Monster"}), group("Destroyed Pendulum card face-up",1,{frame:"pendulum",type:"Pendulum Monster Card"})], 1),
      track([group("Eligible Pendulum Summon cards",1,{frame:"pendulum",type:"Pendulum Monster",requirements:"Cards Pendulum Summoned from hand and/or the face-up Extra Deck; exact names depend on the setup."})], [], [card("Odd-Eyes Override Dragon")], [group("Face-up Pendulum cards",1,{frame:"pendulum",type:"Pendulum Monster"}), group("Destroyed Pendulum card face-up",1,{frame:"pendulum",type:"Pendulum Monster Card"})], 2),
      track([], [], [card("Odd-Eyes Override Dragon")], [group("Face-up Pendulum cards",1,{frame:"pendulum",type:"Pendulum Monster"}), group("Destroyed Pendulum card face-up",1,{frame:"pendulum",type:"Pendulum Monster Card"})], 2)
    ],
    "odd-eyes|Make Odd-Eyes Vortex Dragon": [
      track([card("Performapal Odd-Eyes Dissolver"),card("Odd-Eyes Arc Pendulum Dragon")]),
      track([]),
      track([], [], [card("Odd-Eyes Vortex Dragon")], [card("Performapal Odd-Eyes Dissolver"),card("Odd-Eyes Arc Pendulum Dragon")])
    ],
    "lunalight|Gold Leo: one-card route to two Liger Dancers": [
      track([card("Lunalight Masquerade")], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade")]),
      track([card("Lunalight Tiger"),card("Lunalight Kaleido Chick")], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade"),card("Lunalight Silver Hound"),card("Lunalight Kaleido Chick"),card("Lunalight Tiger")]),
      track([card("Lunalight Tiger"),card("Lunalight Kaleido Chick"),card("Lunalight Black Sheep")], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade"),card("Lunalight Silver Hound"),card("Lunalight Kaleido Chick"),card("Lunalight Tiger"),card("Fire Formation - Tenki"),card("Lunalight Black Sheep")], [card("Brotherhood of the Fire Fist - Tiger King")]),
      track([card("Lunalight Kaleido Chick"),card("Polymerization")], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade"),card("Lunalight Silver Hound"),card("Lunalight Kaleido Chick"),card("Lunalight Tiger"),card("Fire Formation - Tenki"),card("Lunalight Black Sheep"),card("Polymerization")], [card("Brotherhood of the Fire Fist - Tiger King")]),
      track([card("Lunalight Tiger"),card("Polymerization"),card("Luna Light Perfume")], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade"),card("Lunalight Silver Hound"),card("Lunalight Kaleido Chick"),card("Lunalight Tiger"),card("Fire Formation - Tenki"),card("Lunalight Black Sheep"),card("Polymerization"),card("Luna Light Perfume")], [card("Brotherhood of the Fire Fist - Tiger King"),card("Lunalight Perfume Dancer")]),
      track([], [card("Lunalight Yellow Marten"),card("Lunalight Masquerade"),card("Lunalight Silver Hound"),card("Lunalight Kaleido Chick"),card("Lunalight Tiger"),card("Fire Formation - Tenki"),card("Lunalight Black Sheep"),card("Polymerization"),card("Luna Light Perfume")], [card("Brotherhood of the Fire Fist - Tiger King"),card("Lunalight Perfume Dancer"),card("Cross-Sheep"),card("S:P Little Knight"),card("Lunalight Liger Dancer",2)])
    ],
    "lunalight|Going second: Lunalight Fusion into Liger Dancer": [
      track([card("Lunalight Fusion"),group("Lunalight monster",2,{type:"Lunalight Monster",frame:"monster",requirements:"Two Lunalight monsters from your opening hand."})]),
      track([], [group("Lunalight monster sent from the Deck",1,{type:"Lunalight Monster",frame:"monster",requirements:"The Lunalight monster chosen from the Main Deck as Fusion Material."})], [card("Lunalight Leo Dancer"),card("Lunalight Liger Dancer")], [], 1, 1),
      track([], [group("Lunalight monster sent from the Deck",1,{type:"Lunalight Monster",frame:"monster",requirements:"The Lunalight monster chosen from the Main Deck as Fusion Material."})], [card("Lunalight Leo Dancer"),card("Lunalight Liger Dancer")], [], 1, 2)
    ],
    "lunalight|Scarlet Tiger turns a Lunalight effect into Polymerization": [
      track([card("Lunalight Scarlet Tiger"),group("Other Lunalight monsters",2,{type:"Lunalight Monster",frame:"monster"})]),
      track([group("Other Lunalight monsters",2,{type:"Lunalight Monster",frame:"monster"}),card("Polymerization")], [card("Polymerization")]),
      track([], [card("Polymerization")], [], [], 0, 1)
    ],
    "speedroid|Terrortop alone into a Level 7 Clear Wing": [
      track([card("Speedroid Marble Machine")], [card("Speedroid Marble Machine")]),
      track([], [card("Speedroid Marble Machine"),card("Speedroid Taketomborg")]),
      track([], [card("Speedroid Marble Machine"),card("Speedroid Taketomborg"),card("Speedroid Red-Eyed Dice")]),
      track([], [card("Speedroid Marble Machine"),card("Speedroid Taketomborg"),card("Speedroid Red-Eyed Dice")]),
      track([], [card("Speedroid Marble Machine"),card("Speedroid Taketomborg"),card("Speedroid Red-Eyed Dice")], [card("Clear Wing Synchro Dragon")])
    ],
    "speedroid|Two Pendulum Scales directly make Clear Wing": [
      track([], [], [], []),
      track([], [], [card("Clear Wing Synchro Dragon")], [card("Speedroid Wing Synchron"),card("Speedroid Marble Machine")])
    ],
    "speedroid|Marble Machine plus Taketomborg into a Synchro": [
      track([card("Speedroid Taketomborg"),card("Speedroid Red-Eyed Dice")], [card("Speedroid Red-Eyed Dice")]),
      track([], [card("Speedroid Red-Eyed Dice")]),
      track([], [card("Speedroid Red-Eyed Dice")], [card("Hi-Speedroid Chanbara")])
    ],
    "chronicles|Branded Fusion into Mirrorjade": [
      track([any("Discard card for Lubellion")], [card("Fallen of Albaz"),card("Despian Tragedy")], [card("Lubellion the Searing Dragon")]),
      track([any("Discard card for Lubellion"),group("Despia monster added to hand",1,{type:"Despia Monster",frame:"monster",requirements:"A Despia monster searched by Despian Tragedy."})], [card("Fallen of Albaz"),card("Despian Tragedy")], [card("Lubellion the Searing Dragon")], [], 1),
      track([group("Despia monster added to hand",1,{type:"Despia Monster",frame:"monster",requirements:"The Despia monster searched by Despian Tragedy remains in hand."})], [card("Despian Tragedy")], [card("Mirrorjade the Iceblade Dragon")], [], 1),
      track([group("Despia monster added to hand",1,{type:"Despia Monster",frame:"monster",requirements:"The Despia monster searched by Despian Tragedy remains in hand."})], [card("Despian Tragedy")], [card("Mirrorjade the Iceblade Dragon")], [], 1)
    ],
    "chronicles|Fallen of Albaz uses an opponent’s LIGHT monster": [
      track([any("Discard card")]),
      track([]),
      track([], [], [card("Albion the Branded Dragon")]),
      track([], [], [card("Albion the Branded Dragon"),card("Mirrorjade the Iceblade Dragon")])
    ],
    "chronicles|Nadir Servant sets an Albaz follow-up": [
      track([group("Dogmatika monster or Fallen of Albaz",1,{type:"Monster",frame:"monster",requirements:"The legal card selected by Nadir Servant; the exact identity depends on the Deck/GY state."})], [group("Dogmatika monster or Fallen of Albaz",1,{type:"Monster",frame:"monster",requirements:"The exact search target is not specified in the combo line."})], [card("Titaniklad the Ash Dragon")], [], 1),
      track([group("Dogmatika monster or Fallen of Albaz",1,{type:"Monster",frame:"monster",requirements:"The legal card selected by Nadir Servant; the exact identity depends on the Deck/GY state."})], [group("Dogmatika monster or Fallen of Albaz",1,{type:"Monster",frame:"monster"})], [card("Titaniklad the Ash Dragon")], [], 1),
      track([group("Dogmatika monster or Fallen of Albaz added to hand",1,{type:"Monster",frame:"monster",requirements:"This preview chooses Titaniklad’s add-to-hand option for tracking; its alternate Special Summon option places it on the field."})], [group("Dogmatika monster or Fallen of Albaz",1,{type:"Monster",frame:"monster"})], [card("Titaniklad the Ash Dragon")], [], 1)
    ]
  };
})();
