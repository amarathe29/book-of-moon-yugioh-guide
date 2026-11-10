(() => {
  const root = document.getElementById('advanced-quiz-card');
  if (!root) return;
  const questions = [
    {q:'When can you activate Blackwing Full Armor Master’s effect to take control of a monster with a Wedge Counter?',a:['During your Main Phase, in an open game state','During either player’s turn as a Quick Effect','Only during the Battle Phase','Only during the End Phase'],correct:0,why:'Its control-changing effect is an Ignition Effect. The separate destruction effect is used in your End Phase.'},
    {q:'When do you choose the monster targeted by Book of Moon?',a:['As you activate Book of Moon','As the Chain finishes resolving','After the monster changes position','At any time during the turn'],correct:0,why:'Targeting is an activation procedure. Choose a legal target before players add responses.'},
    {q:'In modern PSCT, what does text before a semicolon normally describe?',a:['Activation procedures such as costs or targeting','Only what happens after the Chain resolves','The opponent’s next action','A permanent effect that never starts a Chain'],correct:0,why:'The semicolon separates activation procedures from the instructions that resolve later.'},
    {q:'An effect Special Summons a monster, then draws a card. What happens to an optional “When this card is Special Summoned: You can …” effect?',a:['It may miss its activation timing because the draw happened last','It must activate before the draw occurs','It always activates as soon as the monster appears','It becomes a Quick Effect'],correct:0,why:'The draw follows the Summon during resolution. An optional “When … you can” effect generally needs the event to be the last thing that happened.'},
    {q:'Monster Reborn is Chain Link 1 and Solemn Judgment is Chain Link 2. Which resolves first?',a:['Solemn Judgment','Monster Reborn','Both resolve together','The turn player chooses'],correct:0,why:'Resolve a Chain backward, starting with the most recently added link.'},
    {q:'When is a monster determined to be destroyed by battle normally sent to the Graveyard?',a:['At the end of the Damage Step','Immediately when the attack is declared','Before damage calculation','At the start of the next turn'],correct:0,why:'Destruction is determined during damage calculation; the monster is normally sent to the Graveyard at the end of the Damage Step.'},
    {q:'Can Solemn Judgment interrupt Monster Reborn after Reborn has started resolving to negate the Summon?',a:['No; it can respond to Monster Reborn’s activation instead','Yes; players can interrupt any resolving Chain Link','Yes, if it is the opponent’s turn','Only if the monster is Level 4'],correct:0,why:'Players cannot add a Chain Link in the middle of a resolving effect. Judgment can respond to the Spell Card’s activation.'},
    {q:'When simultaneous Trigger Effects are put on a Chain, which group goes first?',a:['The turn player’s mandatory effects','The opponent’s optional effects','The turn player’s optional effects','All Quick Effects'],correct:0,why:'Mandatory effects precede optional effects; within each group, the turn player’s effects go before the opponent’s.'},
    {q:'Can you activate every Quick Effect during the Damage Step?',a:['No; Damage Step timing has additional restrictions','Yes, every Spell Speed 2 effect is legal','Only if it targets a monster','Yes, as long as it is your turn'],correct:0,why:'Damage Step substeps permit only certain effects and cards. Check the specific timing and card ruling.'},
    {q:'A card restricts Extra Deck Special Summons for the turn you activate it. When must you consider the restriction?',a:['Before and after activation, throughout the stated turn','Only after the card leaves the field','Only during the opponent’s turn','Only while the card is face-up'],correct:0,why:'A restriction applying to the turn of activation can make an earlier incompatible Summon prevent the activation in the first place.'}
  ];
  let index = 0, score = 0, answered = false;
  function render() {
    const item = questions[index];
    const order = item.a.map((_,i)=>(i+index)%item.a.length);
    root.innerHTML = '<div class="quiz-top"><span>Question '+(index+1)+' of '+questions.length+'</span><span>Score '+score+'</span></div><h3>'+item.q+'</h3><div class="answers">'+order.map((original,i)=>'<button type="button" data-advanced-answer="'+i+'">'+item.a[original]+'</button>').join('')+'</div><p class="feedback" role="status" aria-live="polite"></p><div class="quiz-bottom"><span class="step-count">Choose an answer</span><button type="button" data-advanced-next disabled>'+(index===questions.length-1?'See result':'Next question')+' →</button></div>';
    root.querySelectorAll('[data-advanced-answer]').forEach(button=>button.addEventListener('click',()=>{
      if(answered)return;
      answered=true;
      const chosen=Number(button.dataset.advancedAnswer),right=order[chosen]===item.correct;
      if(right)score++;
      root.querySelectorAll('[data-advanced-answer]').forEach((item,i)=>{item.disabled=true;if(order[i]===questions[index].correct)item.classList.add('correct');});
      button.classList.add(right?'correct':'incorrect');
      root.querySelector('.quiz-top span:last-child').textContent='Score '+score;
      root.querySelector('.feedback').textContent=(right?'Correct. ':'Not quite. ')+questions[index].why;
      root.querySelector('.step-count').textContent='Answer recorded';
      root.querySelector('[data-advanced-next]').disabled=false;
    }));
    root.querySelector('[data-advanced-next]').addEventListener('click',()=>{
      if(!answered)return;
      if(index===questions.length-1){root.innerHTML='<h3>Quiz complete</h3><p>You answered '+score+' of '+questions.length+' correctly.</p><button type="button" data-advanced-restart>Try again</button>';root.querySelector('[data-advanced-restart]').addEventListener('click',()=>{index=0;score=0;answered=false;render()});return;}
      index++;answered=false;render();
    });
  }
  render();
})();