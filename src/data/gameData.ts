import { 
  CharacterClass, 
  Difficulty, 
  InventoryItem, 
  TriviaQuestion, 
  ZoneData,
  EnemyTemplate
} from '../types/game';

export const GAME_MANIFESTO = {
  title: 'ROCK AND BIRRA Y ZOMBIS',
  protagonist: 'El Coach de la Birra',
  protagonistBio: 'Un sobreviviente común y corriente que, por alguna inexplicable razón, considera que sobrevivir al apocalipsis no tiene sentido si no puede terminar el día con una buena pizza y una cerveza helada.',
  goldenRule: '“Mientras quede una pizza y una cerveza, todavía no se acaba el mundo.”',
  loop: 'Explorar → conseguir comida/birra → combatir zombis → saquear lugares → mejorar equipo → tomar decisiones estúpidas → meterse en problemas → sobrevivir de milagro → repetir.',
  worldLore: 'La civilización cayó. Las ciudades están llenas de zombis, supermercados saqueados, bares abandonados, estaciones de servicio convertidas en fortalezas y bandas de sobrevivientes bastante más peligrosas que los muertos vivientes.',
  slogan: '“Esta vaina se jodió... hay que sobrevivir.”',
  hashtag: '#YConCervezaMejor',
  text: 'La vida es muy corta para tomar cerveza barata y escuchar mala música. ¡Salud!',
  credits: 'Creado e inventado por: LucyYoly-Soft, "Papito es el Mejor" Company.',
};

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    key: 'rockero',
    name: 'Rockero de Garage',
    subtitle: 'Sobreviviente de mil mosh pits',
    description: 'Alta resistencia, aguante y cuerpo curtido por el pogo. Su guitarra es un arma de destrucción masiva.',
    maxHp: 42,
    attack: 7,
    defense: 4,
    maxEnergy: 10,
    skillName: 'Power Chord',
    skillCost: 4,
    skillDesc: 'Un acorde con tanto overdrive y acople sucio que desintegra los tímpanos podridos de los zombies (daño masivo).'
  },
  {
    key: 'punk',
    name: 'Punk Anarquista',
    subtitle: 'La mecha encendida del barrio',
    description: 'Menos salud base pero letal y explosivo. No cree en las leyes de la física ni en las armaduras zombi.',
    maxHp: 26,
    attack: 9,
    defense: 1,
    maxEnergy: 12,
    skillName: 'Molotov de Garage',
    skillCost: 6,
    skillDesc: 'Una botella rellena de nafta premium e ideales antiautoritarios. Ignora la defensa del rival por completo.'
  },
  {
    key: 'motoquero',
    name: 'Motoquero Fugitivo',
    subtitle: 'Cuero, grasa de motor y actitud',
    description: 'Equilibrado y peligroso. Golpea con la pesada cadena de su moto chopper en un latigazo crítico letal.',
    maxHp: 32,
    attack: 8,
    defense: 3,
    maxEnergy: 10,
    skillName: 'Cadenazo Sorpresa',
    skillCost: 5,
    skillDesc: 'Ataque veloz con la cadena de transmisión de la moto con altísima probabilidad de impacto crítico demoledor.'
  }
];

export const GAME_DIFFICULTIES: Difficulty[] = [
  {
    key: 'facil',
    name: 'FÁCIL - "Tranqui con Birra"',
    desc: 'Para bajar la cerveza sin tanto estrés. Menos zombis rabiosos y el apocalipsis avanza a paso lento.',
    apocalypseMult: 0.65,
    enemyMult: 0.85,
    pizzasRequired: 2,
    beersRequired: 2
  },
  {
    key: 'normal',
    name: 'NORMAL - "La Experiencia Real"',
    desc: 'El balance ideal entre peligro inminente, riffs pesados y supervivencia callejera clásica.',
    apocalypseMult: 1.0,
    enemyMult: 1.0,
    pizzasRequired: 3,
    beersRequired: 3
  },
  {
    key: 'dificil',
    name: 'DIFÍCIL - "Apocalipsis Total"',
    desc: 'El mundo se cae a pedazos a toda velocidad, los zombis muerden con saña y la pizza escasea.',
    apocalypseMult: 1.45,
    enemyMult: 1.3,
    pizzasRequired: 4,
    beersRequired: 4
  }
];

export const INITIAL_ITEMS: Record<string, InventoryItem> = {
  bebida_energetica: {
    id: 'bebida_energetica',
    name: 'Lata de bebida energética vencida',
    desc: 'Restaura 14 de vida. Sabe a batería oxidada, pero te pone de pie.',
    type: 'health',
    value: 14,
    icon: '⚡'
  },
  vendaje: {
    id: 'vendaje',
    name: 'Vendaje improvisado de franela',
    desc: 'Restaura 10 de vida. Huele raro a nafta, pero sella la mordida.',
    type: 'health',
    value: 10,
    icon: '🩹'
  },
  sandwich_lata: {
    id: 'sandwich_lata',
    name: 'Sándwich de Lata Misteriosa',
    desc: 'Restaura 18 de vida. Mejor no investigar de qué animal o conserva provino.',
    type: 'health',
    value: 18,
    icon: '🥪'
  },
  birra_artesanal: {
    id: 'birra_artesanal',
    name: 'Cerveza Artesanal "La Resistencia"',
    desc: 'Restaura 24 de vida y otorga coraje rockero. #YConCervezaMejor',
    type: 'health',
    value: 24,
    icon: '🍺'
  },
  energizante_robado: {
    id: 'energizante_robado',
    name: 'Energizante Farmacéutico Robado',
    desc: 'Restaura 10 puntos de energía de golpe. Un subidón eléctrico instantáneo.',
    type: 'energy',
    value: 10,
    icon: '🔋'
  },
  botiquin_militar: {
    id: 'botiquin_militar',
    name: 'Botiquín de Emergencia Militar',
    desc: 'Cura el 100% de la salud. Tan codiciado como un amplificador a válvulas de 1972.',
    type: 'health',
    value: 999,
    icon: '🩺'
  }
};

export const ZONES_DATA: Record<string, ZoneData> = {
  bunker: {
    key: 'bunker',
    name: 'El Búnker del Barrio',
    shortName: 'Búnker Seguro',
    tagline: 'Tu base subterránea de operaciones y santuario de garage rock',
    description: 'Un sótano fortificado con un generador ruidoso, amplificadores apilados, olor a cerveza y un cartel de neón que reza: "PROHIBIDO ENTRAR SIN CERVEZA". Acá ningún zombi puede entrar.',
    bgImage: '/src/assets/images/scene_bunker_1790985483820.jpg',
    connections: ['supermercado', 'barrio'],
    isSafeBunker: true,
    enemyEncounterRate: 0,
    pizzaChance: 0,
    beerChance: 0,
    templates: [],
    hotspots: [
      {
        id: 'bunker_radio',
        label: 'Tornamesa y Radio',
        xPercent: 78,
        yPercent: 48,
        tooltip: 'Sintonizar Rock & Birra Radio',
        actionType: 'radio',
        flavorText: 'La aguja raspa el vinilo. ¡Empieza a sonar un riff de garage demoledor!'
      },
      {
        id: 'bunker_fridge',
        label: 'Heladera Oxidada',
        xPercent: 22,
        yPercent: 55,
        tooltip: 'Revisar la heladera del búnker',
        actionType: 'loot',
        itemReward: 'bebida_energetica',
        flavorText: 'Entre hielo y botellas vacías rescatás una lata de bebida energizante.'
      },
      {
        id: 'bunker_generator',
        label: 'Generador Diésel',
        xPercent: 44,
        yPercent: 72,
        tooltip: 'Inspeccionar generador',
        actionType: 'inspect',
        flavorText: 'Tose humo negro pero mientras tenga combustible, las luces y la música no se apagan.'
      },
      {
        id: 'bunker_bed',
        label: 'Colchón de Campaña',
        xPercent: 62,
        yPercent: 70,
        tooltip: 'Descansar y recuperar vida (5 chapas)',
        actionType: 'rest',
        flavorText: 'Te tirás en el colchón viejo. Cero glamour, 100% regeneración.'
      }
    ]
  },
  supermercado: {
    key: 'supermercado',
    name: 'Supermercado "El Ahorro Feroz"',
    shortName: 'El Ahorro Feroz',
    tagline: 'Góndolas volcadas, saqueos caóticos y ofertas que caducaron',
    description: 'El viejo supermercado mayorista del barrio. La música funcional se trabó en un bucle tétrico. Entre los pasillos de comida enlatada deambulan oficinistas y cajeras mutadas que aún piden cambio de billete.',
    bgImage: '/src/assets/images/scene_supermercado_1790985494228.jpg',
    connections: ['bunker', 'bar', 'barrio'],
    enemyEncounterRate: 0.45,
    pizzaChance: 0.35,
    beerChance: 0.12,
    templates: [
      { name: 'Zombi de Oficina (con corbata rota)', hp: 14, attack: 4, defense: 0, exp: 8, caps: 4 },
      { name: 'Cajera Zombi del Turno Noche', hp: 18, attack: 5, defense: 1, exp: 12, caps: 6 },
      { name: 'Repositor Poseído de Lácteos', hp: 20, attack: 6, defense: 1, exp: 14, caps: 7 }
    ],
    hotspots: [
      {
        id: 'sup_register',
        label: 'Caja Registradora Saqueada',
        xPercent: 72,
        yPercent: 64,
        tooltip: 'Revisar cajón de dinero',
        actionType: 'loot',
        capsReward: 6,
        flavorText: 'Entre billetes sin valor encontrás 6 chapas útiles para el apocalipsis.'
      },
      {
        id: 'sup_cart',
        label: 'Carrito Volcado',
        xPercent: 32,
        yPercent: 75,
        tooltip: 'Revisar carrito de compras',
        actionType: 'loot',
        itemReward: 'sandwich_lata',
        flavorText: '¡Bingo! Una lata sin abolladuras de contenido altamente calórico.'
      },
      {
        id: 'sup_shelves',
        label: 'Góndola de Congelados',
        xPercent: 50,
        yPercent: 45,
        tooltip: 'Inspeccionar sector de pizzas',
        actionType: 'inspect',
        flavorText: 'Todo descongelado hace meses... pero el aroma a orégano te da esperanzas.'
      }
    ]
  },
  barrio: {
    key: 'barrio',
    name: 'Barrio Abandonado',
    shortName: 'Calles del Barrio',
    tagline: 'Escombros de muscle cars, perros mutantes y grafitis rockeros',
    description: 'Las calles por donde solías caminar con tus discos de vinilo bajo el brazo. Ahora los autos están volcados, las farolas parpadean en un atardecer naranja y en la pared un aerosol gigante dice: "AQUÍ MURIÓ EL ROCK".',
    bgImage: '/src/assets/images/scene_barrio_1790985503479.jpg',
    connections: ['bunker', 'supermercado', 'gasolinera'],
    enemyEncounterRate: 0.42,
    pizzaChance: 0.18,
    beerChance: 0.22,
    templates: [
      { name: 'Perro Callejero Zombi', hp: 12, attack: 7, defense: 0, exp: 10, caps: 3 },
      { name: 'Vecino Chismoso Zombi', hp: 20, attack: 5, defense: 1, exp: 12, caps: 6 },
      { name: 'Skater Zombi con Tabla Astillada', hp: 16, attack: 6, defense: 1, exp: 13, caps: 5 }
    ],
    hotspots: [
      {
        id: 'barrio_car',
        label: 'Muscle Car Estrellado',
        xPercent: 65,
        yPercent: 68,
        tooltip: 'Revisar guantera del auto',
        actionType: 'loot',
        itemReward: 'vendaje',
        flavorText: 'Sacás un trapo limpio y alcohol de botiquín del asiento trasero.'
      },
      {
        id: 'barrio_graffiti',
        label: 'Mural "AQUÍ MURIÓ EL ROCK"',
        xPercent: 35,
        yPercent: 42,
        tooltip: 'Leer pintada en la pared',
        actionType: 'inspect',
        flavorText: 'Alguien tachó la frase y abajo escribió con aerosol: "MENTIRA, EL ROCK VIVE CON BIRRA".'
      },
      {
        id: 'barrio_trash',
        label: 'Contenedor en Llamas',
        xPercent: 18,
        yPercent: 62,
        tooltip: 'Buscar restos de comida',
        actionType: 'loot',
        capsReward: 4,
        flavorText: 'Rescatás 4 chapitas brillantes de cerveza artesanal pisoteadas en el barro.'
      }
    ]
  },
  bar: {
    key: 'bar',
    name: 'Bar Clausurado "El Aullido"',
    shortName: 'Bar El Aullido',
    tagline: 'El legendario templo del rock subterráneo y las canillas de birra',
    description: 'El viejo bar donde se gestaron las mejores bandas del circuito. Los amplificadores Marshall siguen en el escenario y las canillas de cerveza aún conservan el aroma a lúpulo fresco. Alma, la antigua cantante, se convirtió en una criatura temible que custodia el lugar.',
    bgImage: '/src/assets/images/scene_bar_1790985512178.jpg',
    connections: ['supermercado', 'gasolinera', 'secreta'],
    enemyEncounterRate: 0.52,
    pizzaChance: 0.12,
    beerChance: 0.48,
    templates: [
      { name: 'Barman Zombi con Coctelera Rota', hp: 22, attack: 6, defense: 2, exp: 15, caps: 8 },
      { name: 'Groupie Zombi Fanática', hp: 18, attack: 6, defense: 1, exp: 13, caps: 7 },
      { name: 'Bajista Zombi Sin Afinación', hp: 24, attack: 7, defense: 2, exp: 17, caps: 9 }
    ],
    hotspots: [
      {
        id: 'bar_taps',
        label: 'Grifos de Cerveza Artesanal',
        xPercent: 42,
        yPercent: 58,
        tooltip: 'Servir una cerveza del barril',
        actionType: 'loot',
        itemReward: 'birra_artesanal',
        flavorText: 'Tirás de la manija dorada: ¡sale una pinta con espuma perfecta y lúpulo fresco!'
      },
      {
        id: 'bar_jukebox',
        label: 'Rocola Iluminada',
        xPercent: 78,
        yPercent: 62,
        tooltip: 'Encender rocola del bar',
        actionType: 'radio',
        flavorText: 'La rocola ruge con un clásico de rock valvular. ¡El espíritu del Aullido no murió!'
      },
      {
        id: 'bar_stage',
        label: 'Escenario y Batería',
        xPercent: 20,
        yPercent: 48,
        tooltip: 'Mirar el escenario',
        actionType: 'inspect',
        flavorText: 'Pedales de distorsión pisoteados y baquetas partidas. Alma solía cantar acá antes del fin.'
      }
    ]
  },
  gasolinera: {
    key: 'gasolinera',
    name: 'Gasolinera "El Último Surtidor"',
    shortName: 'El Último Surtidor',
    tagline: 'Fortín militarizado donde descansa la camioneta de pizzas intacta',
    description: 'La estación de servicio del pueblo fue tomada por el Comandante Ferro y sus zombis motociclistas. Según los rumores de la radio, una camioneta de reparto de pizza express quedó blindada y sellada con cajas térmicas en su interior.',
    bgImage: '/src/assets/images/scene_gasolinera_1790985522571.jpg',
    connections: ['barrio', 'bar', 'secreta'],
    enemyEncounterRate: 0.6,
    pizzaChance: 0.45,
    beerChance: 0.28,
    templates: [
      { name: 'Motoquero Infectado con Tachas', hp: 26, attack: 8, defense: 2, exp: 18, caps: 11 },
      { name: 'Cacique del Chatarral', hp: 35, attack: 9, defense: 3, exp: 26, caps: 16 }
    ],
    hotspots: [
      {
        id: 'gas_truck',
        label: 'Camioneta de Pizza Blindada',
        xPercent: 30,
        yPercent: 58,
        tooltip: 'Forzar puerta trasera de pizzas',
        actionType: 'loot',
        capsReward: 8,
        flavorText: '¡Dentro hay una caja térmica sellada con provisiones cruciales y chapitas!'
      },
      {
        id: 'gas_pumps',
        label: 'Surtidor con Alambre de Púas',
        xPercent: 65,
        yPercent: 64,
        tooltip: 'Revisar área de combustible',
        actionType: 'loot',
        itemReward: 'energizante_robado',
        flavorText: 'Encuentras un energizante intacto en la cabina de cobro.'
      },
      {
        id: 'gas_flags',
        label: 'Estandarte de Boina Roja',
        xPercent: 52,
        yPercent: 28,
        tooltip: 'Inspeccionar bandera del Comandante',
        actionType: 'inspect',
        flavorText: 'La bandera roja desgarrada del Comandante Ferro ondea sobre el techo de chapa.'
      }
    ]
  },
  secreta: {
    key: 'secreta',
    name: 'El Refugio Secreto de Alma y Ferro',
    shortName: 'Refugio Secreto',
    tagline: 'Escondite oculto VIP con comida gourmet y birra de colección',
    description: 'Un refugio subterráneo de lujo que compartían la Sirena y el Comandante antes de mutar. Acá hay un generador silencioso, una heladera de cristal con cerveza importada y una caja fuerte entreabierta repleta de delicias.',
    bgImage: '/src/assets/images/scene_bunker_1790985483820.jpg',
    connections: ['bar', 'gasolinera'],
    enemyEncounterRate: 0,
    pizzaChance: 0,
    beerChance: 0,
    templates: [],
    hotspots: [
      {
        id: 'secret_safe',
        label: 'Caja Fuerte VIP',
        xPercent: 50,
        yPercent: 55,
        tooltip: 'Abrir caja fuerte secreta',
        actionType: 'secret',
        flavorText: '¡ABRÍS LA CAJA FUERTE! Hay 25 chapas de oro, una pizza entera crujiente y una cerveza imperial.'
      }
    ]
  }
};

export const BOSS_FERRO: EnemyTemplate = {
  name: 'Comandante Ferro "Boina Roja"',
  hp: 58,
  attack: 10,
  defense: 4,
  exp: 45,
  caps: 30,
  isBoss: true,
  bossType: 'golpe'
};

export const BOSS_ALMA: EnemyTemplate = {
  name: 'Alma, "la Sirena del Aullido"',
  hp: 52,
  attack: 8,
  defense: 3,
  exp: 42,
  caps: 26,
  isBoss: true,
  bossType: 'drenaje'
};

export const TRIVIA_DATABASE: TriviaQuestion[] = [
  // --- ROCK FACIL ---
  {
    id: 'r1',
    category: 'rock',
    isHard: false,
    question: '¿Quién es el vocalista histórico de Guns N\' Roses conocido por su pañuelo y voz rasposa?',
    correctAnswer: 'Axl Rose',
    options: ['Axl Rose', 'Slash', 'Duff McKagan', 'Steven Adler']
  },
  {
    id: 'r2',
    category: 'rock',
    isHard: false,
    question: 'El legendario álbum "Back in Black" con campanas fúnebres de apertura es de la banda...',
    correctAnswer: 'AC/DC',
    options: ['AC/DC', 'Iron Maiden', 'Black Sabbath', 'Motörhead']
  },
  {
    id: 'r3',
    category: 'rock',
    isHard: false,
    question: '¿Qué icónico guitarrista incendiaba su Fender Stratocaster en vivo y compuso "Purple Haze"?',
    correctAnswer: 'Jimi Hendrix',
    options: ['Jimi Hendrix', 'Eric Clapton', 'Jimmy Page', 'Pete Townshend']
  },
  {
    id: 'r4',
    category: 'rock',
    isHard: false,
    question: '¿De qué país es originaria la banda de thrash metal Metallica?',
    correctAnswer: 'Estados Unidos',
    options: ['Estados Unidos', 'Inglaterra', 'Alemania', 'Australia']
  },
  {
    id: 'r5',
    category: 'rock',
    isHard: false,
    question: '"Persiana Americana" y "De Música Ligera" son himnos inmortales de la banda...',
    correctAnswer: 'Soda Stereo',
    options: ['Soda Stereo', 'Los Enanitos Verdes', 'Héroes del Silencio', 'Virus']
  },
  {
    id: 'r6',
    category: 'rock',
    isHard: false,
    question: '¿En qué año falleció Kurt Cobain, líder de Nirvana?',
    correctAnswer: '1994',
    options: ['1994', '1991', '1996', '1989']
  },
  {
    id: 'r7',
    category: 'rock',
    isHard: false,
    question: '¿Quién lidera The Rolling Stones como carismático vocalista junto a Keith Richards?',
    correctAnswer: 'Mick Jagger',
    options: ['Mick Jagger', 'Ronnie Wood', 'Charlie Watts', 'Roger Daltrey']
  },
  {
    id: 'r8',
    category: 'rock',
    isHard: false,
    question: '¿Qué baterista formó Foo Fighters tras el final trágico de Nirvana?',
    correctAnswer: 'Dave Grohl',
    options: ['Dave Grohl', 'Chad Smith', 'Travis Barker', 'Taylor Hawkins']
  },
  {
    id: 'r9',
    category: 'rock',
    isHard: false,
    question: '¿Qué banda británica compuso la monumental "Stairway to Heaven"?',
    correctAnswer: 'Led Zeppelin',
    options: ['Led Zeppelin', 'Deep Purple', 'Black Sabbath', 'The Who']
  },
  {
    id: 'r10',
    category: 'rock',
    isHard: false,
    question: '¿Cómo se llama el guitarrista de Guns N\' Roses famoso por su galera y cabellera rizada?',
    correctAnswer: 'Slash',
    options: ['Slash', 'Buckethead', 'Izzy Stradlin', 'Kirk Hammett']
  },

  // --- ROCK DIFICIL ---
  {
    id: 'rh1',
    category: 'rock',
    isHard: true,
    question: '¿Cómo se llamaba el genial bajista de Metallica que grabó "Master of Puppets" y falleció en 1986?',
    correctAnswer: 'Cliff Burton',
    options: ['Cliff Burton', 'Jason Newsted', 'Robert Trujillo', 'Ron McGovney']
  },
  {
    id: 'rh2',
    category: 'rock',
    isHard: true,
    question: '¿Cuál es el verdadero nombre del "Príncipe de las Tinieblas", Ozzy Osbourne?',
    correctAnswer: 'John Michael Osbourne',
    options: ['John Michael Osbourne', 'James Owen Osbourne', 'Anthony Peter Osbourne', 'William Ozzy Osbourne']
  },
  {
    id: 'rh3',
    category: 'rock',
    isHard: true,
    question: '¿Qué mítico festival de rock congregó a medio millón de jóvenes en agosto de 1969 en Bethel, NY?',
    correctAnswer: 'Woodstock',
    options: ['Woodstock', 'Altamont', 'Monterey Pop', 'Isle of Wight']
  },
  {
    id: 'rh4',
    category: 'rock',
    isHard: true,
    question: '¿Cómo se llamaba la banda de acompañamiento de David Bowie durante su etapa Ziggy Stardust?',
    correctAnswer: 'The Spiders from Mars',
    options: ['The Spiders from Mars', 'The Thin White Duke Band', 'The Diamond Dogs', 'Tin Machine']
  },
  {
    id: 'rh5',
    category: 'rock',
    isHard: true,
    question: '¿Quién compuso la suite operística "Bohemian Rhapsody" en el piano de su departamento londinense?',
    correctAnswer: 'Freddie Mercury',
    options: ['Freddie Mercury', 'Brian May', 'Roger Taylor', 'John Deacon']
  },
  {
    id: 'rh6',
    category: 'rock',
    isHard: true,
    question: '¿Qué banda pionera del punk neoyorquino debutó en el club CBGB con uniformes de campera de cuero y jeans rotos?',
    correctAnswer: 'The Ramones',
    options: ['The Ramones', 'The Clash', 'Sex Pistols', 'Television']
  },
  {
    id: 'rh7',
    category: 'rock',
    isHard: true,
    question: '¿Cuál es el nombre del álbum conceptual de Pink Floyd con el prisma que refracta la luz blanca?',
    correctAnswer: 'The Dark Side of the Moon',
    options: ['The Dark Side of the Moon', 'Wish You Were Here', 'The Wall', 'Animals']
  },

  // --- CINE FACIL ---
  {
    id: 'c1',
    category: 'cine',
    isHard: false,
    question: '¿Quién dirigió la obra de culto "Pulp Fiction" (Tiempos Violentos)?',
    correctAnswer: 'Quentin Tarantino',
    options: ['Quentin Tarantino', 'Martin Scorsese', 'Guy Ritchie', 'David Fincher']
  },
  {
    id: 'c2',
    category: 'cine',
    isHard: false,
    question: '"Que la fuerza te acompañe" es el lema supremo de la saga galáctica...',
    correctAnswer: 'Star Wars',
    options: ['Star Wars', 'Star Trek', 'Dune', 'Guardianes de la Galaxia']
  },
  {
    id: 'c3',
    category: 'cine',
    isHard: false,
    question: '¿Quién interpretó magistralmente al Joker en "The Dark Knight" (2008) de Nolan?',
    correctAnswer: 'Heath Ledger',
    options: ['Heath Ledger', 'Joaquin Phoenix', 'Jack Nicholson', 'Jared Leto']
  },
  {
    id: 'c4',
    category: 'cine',
    isHard: false,
    question: '¿Qué actor encarnó al multimillonario Tony Stark / Iron Man en el Universo Marvel?',
    correctAnswer: 'Robert Downey Jr.',
    options: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Christian Bale']
  },
  {
    id: 'c5',
    category: 'cine',
    isHard: false,
    question: '¿Quién dirigió la trilogía maestra de "El Padrino"?',
    correctAnswer: 'Francis Ford Coppola',
    options: ['Francis Ford Coppola', 'Martin Scorsese', 'Brian De Palma', 'Sergio Leone']
  },
  {
    id: 'c6',
    category: 'cine',
    isHard: false,
    question: '¿Qué director creó "Jurassic Park", "Tiburón" e "Indiana Jones"?',
    correctAnswer: 'Steven Spielberg',
    options: ['Steven Spielberg', 'James Cameron', 'George Lucas', 'Ridley Scott']
  },
  {
    id: 'c7',
    category: 'cine',
    isHard: false,
    question: '¿En qué clásica saga cinematográfica aparecen Frodo Bolsón, Aragorn y Gandalf el Gris?',
    correctAnswer: 'El Señor de los Anillos',
    options: ['El Señor de los Anillos', 'Las Crónicas de Narnia', 'Harry Potter', 'Willow']
  },
  {
    id: 'c8',
    category: 'cine',
    isHard: false,
    question: '¿Quién interpretó a Neo, "El Elegido", en la película Matrix (1999)?',
    correctAnswer: 'Keanu Reeves',
    options: ['Keanu Reeves', 'Brad Pitt', 'Tom Cruise', 'Will Smith']
  },

  // --- CINE DIFICIL ---
  {
    id: 'ch1',
    category: 'cine',
    isHard: true,
    question: '¿Qué modelo específico de cíborg asesino interpreta Schwarzenegger en Terminator?',
    correctAnswer: 'Cyberdyne Systems Modelo T-800',
    options: ['Cyberdyne Systems Modelo T-800', 'T-1000 de metal líquido', 'T-600 blindado', 'T-X Terminatrix']
  },
  {
    id: 'ch2',
    category: 'cine',
    isHard: true,
    question: '¿En qué año se estrenó en cines la icónica "Volver al Futuro" con el DeLorean?',
    correctAnswer: '1985',
    options: ['1985', '1982', '1988', '1989']
  },
  {
    id: 'ch3',
    category: 'cine',
    isHard: true,
    question: '¿Quiénes dirigieron la revolucionaria película de ciencia ficción Matrix (1999)?',
    correctAnswer: 'Las hermanas Wachowski',
    options: ['Las hermanas Wachowski', 'Hermanos Coen', 'Hermanos Russo', 'David Cronenberg']
  },
  {
    id: 'ch4',
    category: 'cine',
    isHard: true,
    question: '¿Con qué película de supervivencia extrema ganó Leonardo DiCaprio su primer premio Oscar?',
    correctAnswer: 'El Renacido (The Revenant)',
    options: ['El Renacido (The Revenant)', 'El Lobo de Wall Street', 'Titanic', 'Inception (El Origen)']
  },
  {
    id: 'ch5',
    category: 'cine',
    isHard: true,
    question: '¿Qué película surcoreana de Bong Joon-ho fue la primera de habla no inglesa en ganar el Oscar a Mejor Película?',
    correctAnswer: 'Parásitos (Parasite)',
    options: ['Parásitos (Parasite)', 'Oldboy', 'Train to Busan', 'Roma']
  }
];

export const FLAVOR_WALK_EVENTS = [
  { text: '🔩 Entre un montón de escombros y casquillos encuentras 5 chapitas.', caps: 5 },
  { text: '🩹 Un sobreviviente en harapos te arroja un vendaje limpio antes de perderse en un callejón.', item: 'vendaje' },
  { text: '⚠️ ¡Cuidado! Pisaste una tabla podrida con clavos oxidados: pierdes 4 de vida.', damage: 4 },
  { text: '📻 Una radio a pilas en una ventana sintoniza estática y de golpe explota un punteo de guitarra.', sound: true },
  { text: '🍕 Un aroma tenue a salsa de tomate y queso fundido flota en el viento otoñal. ¡Estás cerca!', sound: false },
  { text: '🎸 Te detienes 10 minutos en medio de un cruce a debatir contigo mismo si el solo de "Comfortably Numb" es insuperable. Sobrevives de milagro.', sound: true },
  { text: '🍺 Divisas una lata de cerveza artesanal intacta pero tibia. La abres y te la tomas con orgullo: #YConCervezaMejor.', item: 'birra_artesanal' },
  { text: '🤦‍♂️ Decisión absurda: intentas razonar pacíficamente con un zombi explicándole la discografía de Led Zeppelin. Te tira un mordisco y huyes a las carcajadas.', damage: 3 },
  { text: '🔩 Encuentras un cenicero metálico de bar lleno de chapitas brillantes: ganas 6 chapas.', caps: 6 }
];
