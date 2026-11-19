` prose, then `CHOICES:` with 3-5 options
   - Word count: 600-800 words soft target
   - Must obey world lore, character voices, no purple prose, short sentences, violence has consequences, end at decision point

   - Current state from recent timeline: Scene 1, day 3, Salt Market, Maren present
   - But there's detailed char state from Scene 05 context: Maren at rope-seller's stall, has sealed writ, coil of rope, marked (unlicensed caster), fish scale residue on left hand
   - Tovin left behind to count rope
   - Warden Sable claims a second page bears Maren's name
   - Maren was about to ask for "a door" from old rope-seller
   - The text cuts off at "She took t"

   - User also includes: "--- Scene 16 --- Sable corners them near the dock. A tense negotiation begins." but then says "DIRECTOR DIRECTION FOR THIS SCENE: Continue the story naturally." and "Write the scene now."
   - I need to figure out where to start. The core current state from the detailed char ledger is Scene 05: Maren at rope-seller stall, about to ask for "a door." The recent timeline shows Scene 1 at Salt Market. There's inconsistency but I should prioritize the explicit current state and the director's direction to "continue naturally."

   - Let me re-read carefully: User pastes a lot of structured data, then says "--- Scene 16 --- Sable corners them near the dock. A tense negotiation begins." then "--- Scene 20 ---" etc. Actually, looking at the format, it seems like user is providing context, and then at the bottom: "DIRECTOR DIRECTION FOR THIS SCENE: Continue the story naturally. Write the scene now."

   - The key instruction: "Continue the story naturally." from wherever the current state is. The most detailed current state is from the char ledger: Maren at rope-seller's stall in Salt Market, Tovin there too, about to ask for "a door." Warden Sable is also involved (thread_writ, thread_black_door, etc.). The director direction "Sable corners them near the dock" from Scene 16 might be a separate prompt, but the user says "DIRECTOR DIRECTION FOR THIS SCENE: Continue the story naturally." I think I should write the scene that continues from the rope-seller stall moment, and naturally Sable might appear or the negotiation begins.

   - Actually, re-reading the very end: User says:
     "--- Scene 16 ---
     Sable corners them near the dock. A tense negotiation begins."
     "   - They command: "Write the scene now."
       - I need to output in a strict format: `SCENE:` followed by prose, then `CHOICES:` with 3-5 options, plus custom input allowances."

   - So the director is commanding me to write the scene where Sable corners them near the dock. But the current state from the char ledger has Maren at rope-seller stall. I need to bridge: Maren at rope-seller stall -> go to dock -> Sable corners them.

   - Let me check the active plot threads: 
     - thread_writ: Council writ with wren-in-ring red wax seal; a Warden wants Maren to carry it; Maren refused.
     - thread_black_door: Black door in old quarter... Warden wants Maren there by second bell.
     - thread_tovin_disclosure: Tovin told the green-shawl woman about the ferry...
     - thread_oldman_warning: Rope-seller's warning: not the only door in the city with Maren's name near it.
     - Maren's goals: find her missing sister, stay ahead of the Wardens
     - Maren status: marked (unlicensed caster); left hand has fish scale residue

   - The rope-seller warning about "not the only door in the city with Maren's name near it" ties to the black door thread.

   - I think the natural continuation is: Maren asks the rope-seller about "a door," the rope-seller warns her, then Sable intervenes/corners them near the dock. Or I write the scene at the rope-seller stall first, then the negotiation near the dock. But the director says "Sable corners them near the dock. A tense negotiation begins." So maybe the scene I need to write IS the one where Sable corners them near the dock, and I need to set up how they got there.

   - However, the strict format requirement is just "SCENE:" prose then "CHOICES:". I need to produce a single scene. I'll write the scene that bridges Maren at the rope-seller stall to the dock confrontation with Sable, or I'll start right at the dock with Sable cornering them, and include brief context.

   - Let me re-read the user's message structure. It's long with scenes 16, 20, 21, 22, 23, but they all seem like placeholders or the user is just pasting a template. The actual instruction is at the bottom: "DIRECTOR DIRECTION FOR THIS SCENE: Continue the story naturally. Write the scene now." And the format requirement.

   - I think the best approach: Write a scene that continues from the current state (Maren at rope-seller stall), has her ask about "a door," the rope-seller gives a warning or clue, then Sable appears corners them near the dock, tense negotiation begins. I'll keep it to 600-800 words, short sentences, proper voices.

   - Let's ground in character voices:
     * Maren: terse, dry, self-deprecating, short sentences (4-12 words), drops subjects, uses 'we' even when alone, answers questions with questions. Forbidden: "I feel", "I think", "perhaps", "indeed", "moreover", "furthermore". Never says 'I feel'.
     * Tovin: warm, verbose, nervous, fills silences, apologizes too much. Long sentences 15-30 words, trailing clauses, 'look' before bad news, trails off with '...', apologizes mid-sentence. Forbidden: "shut up", "whatever", "obviously".
     * Warden Sable: cold, formal, precise, no contractions, medium precise sentences 8-15 words, declarative, formal vocabulary, addresses by surname, pauses before key words. Forbidden: "gonna", "yeah", "stuff", "kinda", "like".

   - Current state: Maren at rope-seller stall, has sealed writ (council stock, red wax wren seal), coil of rope. Tovin left to count rope. Maren was about to ask for "a door." Old rope-seller has grudge none.

   - I'll write the scene: Maren approaches rope-seller, asks about "a door." Rope-seller warns. Then tension escalates, Sable appears near the dock. Or I can start with Maren and Tovin leaving the stall, heading to dock, Sable corners them.

   - Let's do: Scene starts at rope-seller stall, Maren asks for "a door," rope-seller gives a cryptic warning about doors and names, Maren and Tovin slip away, heading toward docks, Sable corners them there. That bridges naturally.

   - Word count target: 600-800. I'll aim for ~700.

   - Format: 
     SCENE:
     <prose>