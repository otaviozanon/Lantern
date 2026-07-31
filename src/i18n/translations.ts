export type Language = 'en' | 'pt';
export type TranslationKey = keyof typeof translations.en;

export const translations = {
  en: {
    // Game title
    gameTitle: 'Lantern',
    gameSubtitle: 'A Solitaire Roll & Write Adventure',
    assignDestiny: 'Assign your destiny',

    // Setup
    criticalHit: 'Critical Hit',
    counterAttack: 'Counter-Attack',
    magicSpell: 'Magic Spell',
    constitution: 'Constitution',
    experience: 'Experience',
    bonfireScroll: 'Bonfire Scroll',
    beginJourney: 'Begin Journey',
    sumReroll: 'Sum {sum} < {threshold} — Reroll',

    // Abilities
    crit: 'Crit',
    counter: 'Counter',
    spell: 'Spell',
    endure: 'Endure',
    flipDie: 'Flip die to opposite face',
    addSubtract: 'Add or subtract 1',
    rerollOne: 'Reroll one die',
    rerollSelected: 'Reroll selected dice',

    // HUD
    zone: 'Zone',
    circles: 'Circles',
    matchProgress: 'Match Progress',

    // Zones
    zoneCleared: 'Zone {zone} Cleared!',
    roll6d6: 'Roll 6d6',
    zoneClearedButton: 'Zone Cleared!',
    nextZone: 'Next Zone',
    seeResults: 'See Results',
    chooseBonus: 'Choose where to add +1 circle ({remaining} remaining)',

    // Bonfire
    theBonfire: 'The Bonfire',
    bonfireDesc: 'Rest and reflect. Gain +1 Constitution and reset your Experience.',
    scrollExperience: 'Scroll Experience:',
    restContinue: 'Rest & Continue',

    // Results
    victory: 'Victory',
    gameOver: 'Game Over',
    dragonDefeated: 'The Dragon is Defeated!',
    darknessConsumes: 'Darkness Consumes the Fortress',
    adventureScore: 'Adventure Score',
    newAdventure: 'New Adventure',
    finalResult: 'Final Result',

    // Experience
    xp: 'XP',

    // Zone names
    zone1: 'The Wolves',
    zone2: 'The Cultist',
    zone3: 'The Ruins',
    zone4: 'The Skeletons',
    zone5: 'The Bonfire',
    zone6: 'The Spider',
    zone7: 'The Tower',
    zone8: 'The Dragon',

    // Out of chips
    outOfCircles: 'Out of Circles',

    // Tutorial
    tutorial: 'Tutorial',
    rules: 'Rules',
    language: 'Language',
    skipTutorial: 'Skip Tutorial',
    startTutorial: 'Start Tutorial',
    prevStep: 'Previous',
    nextStep: 'Next',
    finishTutorial: 'Finish',

    // Tutorial steps
    tutorialSetup1: 'Welcome to Lantern! A solo adventure where you climb through 8 zones to defeat the Dragon.',
    tutorialSetup2: 'First, roll 6 dice. If the sum is less than 15, you can reroll.',
    tutorialSetup3: 'Assign each die to an ability or stat. Higher values = more uses.',
    tutorialSetup4: 'Critical Hit: flip a die face. Counter-Attack: +/-1. Magic Spell: reroll one die.',
    tutorialSetup5: 'Constitution lets you reroll any number of selected dice.',
    tutorialSetup6: 'Experience gains +1 every time you roll a 1. Complete lines for bonus ability circles.',
    tutorialSetup7: 'Click "Begin Journey" to start your adventure!',
    tutorialGame1: 'Each zone requires a specific dice combination. Zone 1 needs 2,3,4 + any 3 dice.',
    tutorialGame2: 'Roll 6d6 to enter. If the combo matches immediately, you clear the zone!',
    tutorialGame3: 'If not, enter combat: select a die (golden border), then use an ability.',
    tutorialGame4: 'Spend your circles wisely! If you run out before matching the combo, the adventure ends.',
    tutorialGame5: 'Zone 5 (Bonfire) is special: gain +1 Constitution and reset your Experience.',
    tutorialGame6: 'Zone 8 is the Dragon! You need 6 identical dice. Save your best abilities for it.',
    tutorialGame7: 'Clear all 8 zones to win. Your score is remaining circles. Good luck!',

    // Rules modal content
    rulesTitle: 'Game Rules',
    rulesSetup: 'Setup',
    rulesSetupText: 'Roll 6d6. If sum < 15, you may reroll. Assign one die to each ability and stat.',
    rulesAbilities: 'Abilities',
    rulesCriticalHit: 'Critical Hit — Flip a die to its opposite face (1↔6, 2↔5, 3↔4).',
    rulesCounterAttack: 'Counter-Attack — Add or subtract 1 from a die.',
    rulesMagicSpell: 'Magic Spell — Reroll one die.',
    rulesConstitution: 'Constitution — Reroll any number of selected dice.',
    rulesExperience: 'Experience',
    rulesExpText: 'Gain +1 XP circle whenever you roll a 1. Complete lines (5+4+3) for bonus ability circles at zone exit.',
    rulesZones: 'Zone Requirements',
    rulesCombat: 'Combat',
    rulesCombatText: 'Enter a zone by rolling 6d6. If the combo doesn\'t match, enter combat. Use abilities to manipulate dice. Match the combo to clear the zone. Game over if you run out of circles.',
    rulesZone5: 'Zone 5 — Bonfire',
    rulesZone5Text: 'Special zone: gain +1 Constitution. Replace your Experience with the Bonfire Scroll value (set during setup). No dice roll needed.',
    rulesScoring: 'Scoring',
    rulesScoringText: 'Your score = total remaining circles across all abilities. 0: Promising Adventurer, 1-5: Master at Arms, 6-15: Heroic Swashbuckler, 16+: Legendary Lantern Lord.',
    rulesClose: 'Close',
  },
  pt: {
    gameTitle: 'Lantern',
    gameSubtitle: 'Uma Aventura Solo Roll & Write',
    assignDestiny: 'Defina seu destino',

    criticalHit: 'Acerto Crítico',
    counterAttack: 'Contra-Ataque',
    magicSpell: 'Feitiço Mágico',
    constitution: 'Constituição',
    experience: 'Experiência',
    bonfireScroll: 'Pergaminho',
    beginJourney: 'Iniciar Jornada',
    sumReroll: 'Soma {sum} < {threshold} — Rerrolar',

    crit: 'Crítico',
    counter: 'Contra',
    spell: 'Feitiço',
    endure: 'Suportar',
    flipDie: 'Inverter face do dado',
    addSubtract: 'Adicionar ou subtrair 1',
    rerollOne: 'Rerrolar um dado',
    rerollSelected: 'Rerrolar dados selecionados',

    zone: 'Zona',
    circles: 'Círculos',
    matchProgress: 'Progresso',

    zoneCleared: 'Zona {zone} Concluída!',
    roll6d6: 'Rolar 6d6',
    zoneClearedButton: 'Zona Concluída!',
    nextZone: 'Próxima Zona',
    seeResults: 'Ver Resultado',
    chooseBonus: 'Escolha onde adicionar +1 círculo ({remaining} restantes)',

    theBonfire: 'A Fogueira',
    bonfireDesc: 'Descanse e reflita. Ganhe +1 Constituição e reinicie sua Experiência.',
    scrollExperience: 'Experiência do Pergaminho:',
    restContinue: 'Descansar e Continuar',

    victory: 'Vitória',
    gameOver: 'Fim de Jogo',
    dragonDefeated: 'O Dragão foi Derrotado!',
    darknessConsumes: 'A Escuridão Consome a Fortaleza',
    adventureScore: 'Pontuação da Aventura',
    newAdventure: 'Nova Aventura',
    finalResult: 'Resultado Final',

    xp: 'EXP',

    zone1: 'Os Lobos',
    zone2: 'O Cultista',
    zone3: 'As Ruínas',
    zone4: 'Os Esqueletos',
    zone5: 'A Fogueira',
    zone6: 'A Aranha',
    zone7: 'A Torre',
    zone8: 'O Dragão',

    outOfCircles: 'Sem Círculos',

    tutorial: 'Tutorial',
    rules: 'Regras',
    language: 'Idioma',
    skipTutorial: 'Pular Tutorial',
    startTutorial: 'Iniciar Tutorial',
    prevStep: 'Anterior',
    nextStep: 'Próximo',
    finishTutorial: 'Finalizar',

    tutorialSetup1: 'Bem-vindo ao Lantern! Uma aventura solo onde você escala 8 zonas para derrotar o Dragão.',
    tutorialSetup2: 'Primeiro, role 6 dados. Se a soma for menor que 15, você pode rerrolar.',
    tutorialSetup3: 'Atribua cada dado a uma habilidade ou atributo. Valores maiores = mais usos.',
    tutorialSetup4: 'Acerto Crítico: inverte a face. Contra-Ataque: +/-1. Feitiço Mágico: rerrola um dado.',
    tutorialSetup5: 'Constituição permite rerrolar qualquer quantidade de dados selecionados.',
    tutorialSetup6: 'Experiência ganha +1 sempre que rolar 1. Complete linhas para bônus de círculos.',
    tutorialSetup7: 'Clique em "Iniciar Jornada" para começar sua aventura!',
    tutorialGame1: 'Cada zona exige uma combinação de dados. A Zona 1 precisa de 2,3,4 + 3 dados quaisquer.',
    tutorialGame2: 'Role 6d6 para entrar. Se a combinação bater imediatamente, você limpa a zona!',
    tutorialGame3: 'Se não, entre em combate: selecione um dado (borda dourada) e use uma habilidade.',
    tutorialGame4: 'Gaste seus círculos com sabedoria! Se acabarem antes do combo, a aventura termina.',
    tutorialGame5: 'Zona 5 (Fogueira) é especial: ganhe +1 Constituição e reinicie sua Experiência.',
    tutorialGame6: 'Zona 8 é o Dragão! Você precisa de 6 dados idênticos. Guarde suas melhores habilidades.',
    tutorialGame7: 'Limpe todas as 8 zonas para vencer. Sua pontuação = círculos restantes. Boa sorte!',

    rulesTitle: 'Regras do Jogo',
    rulesSetup: 'Preparação',
    rulesSetupText: 'Role 6d6. Se soma < 15, pode rerrolar. Atribua um dado para cada habilidade e atributo.',
    rulesAbilities: 'Habilidades',
    rulesCriticalHit: 'Acerto Crítico — Inverte um dado para sua face oposta (1↔6, 2↔5, 3↔4).',
    rulesCounterAttack: 'Contra-Ataque — Adiciona ou subtrai 1 de um dado.',
    rulesMagicSpell: 'Feitiço Mágico — Rerrola um dado.',
    rulesConstitution: 'Constituição — Rerrola qualquer quantidade de dados selecionados.',
    rulesExperience: 'Experiência',
    rulesExpText: 'Ganhe +1 círculo de EXP sempre que rolar 1. Complete linhas (5+4+3) para bônus de +1 círculo em qualquer habilidade ao sair da zona.',
    rulesZones: 'Requisitos das Zonas',
    rulesCombat: 'Combate',
    rulesCombatText: 'Entre na zona rolando 6d6. Se o combo não bater, entre em combate. Use habilidades para manipular os dados. Alcance o combo para limpar a zona. Fim de jogo se ficar sem círculos.',
    rulesZone5: 'Zona 5 — A Fogueira',
    rulesZone5Text: 'Zona especial: ganhe +1 Constituição. Substitua sua Experiência pelo valor do Pergaminho da Fogueira (definido na preparação). Sem rolagem de dados.',
    rulesScoring: 'Pontuação',
    rulesScoringText: 'Sua pontuação = total de círculos restantes. 0: Aventureiro Promissor, 1-5: Mestre em Armas, 6-15: Espadachim Heroico, 16+: Lendário Senhor da Lanterna.',
    rulesClose: 'Fechar',
  }
} as const;
