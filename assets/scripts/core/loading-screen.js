function loadFont(scene, fontName, fontData) {
  const texture = scene.textures.get(fontName);
  const image = texture.source[0];
  const imageWidth = image.width;
  const imageHeight = image.height;
  const fontConfig = {
    font: fontName,
    size: 0,
    lineHeight: 0,
    chars: {}
  };
  const kerningPairs = [];
  for (const line of fontData.split("\n")) {
    const lineParts = line.trim().split(/\s+/);
    if (!lineParts.length) continue;
    const lineType = lineParts[0];
    const properties = {};
    for (let i = 1; i < lineParts.length; i++) {
      const equalIndex = lineParts[i].indexOf("=");
      if (equalIndex >= 0) {
        properties[lineParts[i].slice(0, equalIndex)] = lineParts[i].slice(equalIndex + 1).replace(/^"|"$/g, "");
      }
    }
    if (lineType === "info") {
      fontConfig.size = parseInt(properties.size, 10);
    } else if (lineType === "common") {
      fontConfig.lineHeight = parseInt(properties.lineHeight, 10);
    } else if (lineType === "char") {
      const charId = parseInt(properties.id, 10);
      const charX = parseInt(properties.x, 10);
      const charY = parseInt(properties.y, 10);
      const charWidth = parseInt(properties.width, 10);
      const charHeight = parseInt(properties.height, 10);
      const u0 = charX / imageWidth;
      const v0 = charY / imageHeight;
      const u1 = (charX + charWidth) / imageWidth;
      const v1 = (charY + charHeight) / imageHeight;
      fontConfig.chars[charId] = {
        x: charX, y: charY, width: charWidth, height: charHeight,
        centerX: Math.floor(charWidth / 2), centerY: Math.floor(charHeight / 2),
        xOffset: parseInt(properties.xoffset, 10),
        yOffset: parseInt(properties.yoffset, 10),
        xAdvance: parseInt(properties.xadvance, 10),
        data: {}, kerning: {},
        u0, v0, u1, v1
      };
      if (charWidth !== 0 && charHeight !== 0) {
        const charCode = String.fromCharCode(charId);
        const frame = texture.add(charCode, 0, charX, charY, charWidth, charHeight);
        if (frame) frame.setUVs(charWidth, charHeight, u0, v0, u1, v1);
      }
    } else if (lineType === "kerning") {
      kerningPairs.push({
        first: parseInt(properties.first, 10),
        second: parseInt(properties.second, 10),
        amount: parseInt(properties.amount, 10)
      });
    }
  }
  for (const kerningPair of kerningPairs) {
    if (fontConfig.chars[kerningPair.second]) {
      fontConfig.chars[kerningPair.second].kerning[kerningPair.first] = kerningPair.amount;
    }
  }
  scene.cache.bitmapFont.add(fontName, { data: fontConfig, texture: fontName, frame: null });
}

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    if (window.gameCache) window.gameCache.init();
    (function (game) {
      if (game.renderer.type === Phaser.WEBGL) {
        try {
          let gl = game.renderer.gl;
          if (gl && gl.isContextLost()) {
            console.warn('WebGL context lost now using blend modes');
            window.S = Phaser.BlendModes.ADD;
            window.E = Phaser.BlendModes.MULTIPLY;
          } else {
            window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
            window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
          }
        } catch (e) {
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        }
      } else {
        console.log('using Canvas renderer setting blend modes');
        window.S = Phaser.BlendModes.ADD;
        window.E = Phaser.BlendModes.MULTIPLY;
      }
      if (game.canvas) {
        game.canvas.addEventListener('webglcontextlost', (e) => {
          console.warn('WebGL context lost');
          e.preventDefault();
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        });
        
        game.canvas.addEventListener('webglcontextrestored', (e) => {
          console.log('WebGL context is back');
          if (game.renderer.type === Phaser.WEBGL && game.renderer.gl) {
            try {
              let gl = game.renderer.gl;
              window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
              window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
            } catch (e) {
              console.warn('failed to bring back WebGL blend modes:', e);
              window.S = Phaser.BlendModes.ADD;
              window.E = Phaser.BlendModes.MULTIPLY;
            }
          }
        });
      }
    })(this.game);

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2;

    const LOADING_MESSAGES = [
      "Only one?",
      "Listen to the music to help time your jumps",
      "Back for more are ya?",
      "Use practice mode to learn the layout of a level",
      "If at first you don't succeed, try, try again...",
      "Customize your character's icon and color!",
      "You can download all songs from the level select page!",
      "Spikes are not your friends. don't forget to jump",
      "Build your own levels using the level editor",
      "Go online to play other players levels!",
      "Can you beat them all?",
      "Here be dragons...",
      "Pro tip: Don't crash",
      "Hold down to keep jumping",
      "The spikes whisper to me...",
      "Looking for pixels",
      "Loading awesome soundtracks...",
      "What if the spikes are the good guys?",
      "Pro tip: Jump",
      "Does anyone even read this?",
      "Collecting scrap metal",
      "Waiting for planets to align",
      "Starting the flux capacitor",
      "Wandering around aimlessly",
      "Where did I put that coin...",
      "Loading the progressbar",
      "Calculating chance of success",
      "Hiding secrets",
      "Drawing pretty pictures",
      "Programmer is sleeping, please wait",
      "Web is Love, Dasher is Life",
      "Play, Crash, Rage, Quit, Repeat",
      "Only one button required to crash",
      "Such wow, very amaze.",
      "Fus Ro DASH!",
      "Loading Rage Cannon",
      "Counting to 1337",
      "It's all in the timing",
      "Fake spikes are fake",
      "Spikes... OF DOOM!",
      "Why don't you go outside?",
      "Loading will be finished... soon",
      "This seems like a good place to hide a secret...",
      "The vault Keeper's name is 'Spooky'...",
      "Hop the big guy doesn't wakt up...",
      "Shhhh! You're gonna wake the big one!",
      "I have been expecting you.",
      "A wild WebDasher appeared!",
      "So many secrets...",
      "Hiding rocket launcher",
      "It's Over 9000!",
      "Programming amazing AI",
      "Hiding secret vault",
      "Spooky doesn't get out much",
      "Rohan was here",
      "Warp Speed",
      "So, what's up?",
      "Hold on, reading the manual",
      "I don't know how this works...",
      "Why u have to be mad?",
      "It is only game...",
      "Unlock new icons and colors by completing achievements",
      "y=mx+b",
      "Nicest game ever!",
      "S-slopes!~",
      "Anything but slopes",
      "Laggiest game ever."
    ];
    const sliderOriginX = cx - 105;
    const sliderOriginY = cy + 110;
    let sliderFill = null

    this.load.image("game_bg_01", "assets/game-bg/game_bg_01_001-hd.webp");
    this.load.image("sliderBar", "assets/sprites/sliderBar.webp");
    this.load.image("GJ_MenuBeta", "assets/sprites/GJ_MenuBeta.webp");
    this.load.image("Phaserlogo", "assets/sprites/Phaserlogo.webp");
    this.load.image("gravityLine_001", "assets/sprites/gravityLine_001.webp");
    this.load.atlas("GJ_WebSheet", "assets/sheets/GJ_WebSheet.webp", "assets/sheets/GJ_WebSheet.json");
    this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.webp", "assets/sheets/GJ_LaunchSheet.json");
    this.load.image("goldFont", "assets/fonts/goldFont.webp");
    this.load.text("goldFontFnt", "assets/fonts/goldFont.fnt");
    
    this.load.once("complete", () => {
      const tex = this.textures.get("game_bg_01");
      const s = Math.max(W / tex.source[0].width, H / tex.source[0].height);
      const bg = this.add.image(cx, cy, "game_bg_01").setScale(s).setTint(0x0066ff);
      this.children.sendToBack(bg);
      sliderFill = this.add.tileSprite(sliderOriginX - 100, sliderOriginY - 2, 0, 14, "sliderBar");
      sliderFill.setOrigin(0, 0.5);
      this.add.image(sliderOriginX + 105, sliderOriginY, "GJ_WebSheet", "slidergroove.png").setOrigin(0.5, 0.5);
      const goldFontData = this.cache.text.get("goldFontFnt");
      if (goldFontData && !this.cache.bitmapFont.has("goldFont")) {
        loadFont(this, "goldFont", goldFontData);
      }
      const msg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      this.add.bitmapText(cx, cy + 187, "goldFont", msg, 30).setOrigin(0.5);
      const brandLogo = this.add.image(cx, cy - 120, "GJ_LaunchSheet", "PuTopLogoBig_001.png").setOrigin(0.5).setScale(0.8);
      const gjLogo = this.add.image(cx, cy, "GJ_WebSheet", "gj_logo.png").setOrigin(0.5);
      const Logo = this.add.image(1015, 610, "Phaserlogo").setScale(0.115).setInteractive();
      this.children.bringToTop(brandLogo);
      this.children.bringToTop(gjLogo);
      this.children.bringToTop(Logo);
      // No volcamos los assets binarios a localStorage (cuota ~5MB, mucho
      // menos en iOS Safari): con ~75MB de juego eso entraba en un loop de
      // guardar/limpiar sincrono que colgaba la carga en celulares flojos.
      // El cache HTTP del navegador + el Cache-Control del Worker ya cachean
      // estos archivos correctamente.

      this.load.atlas("GJ_GameSheet", "assets/sheets/GJ_GameSheet.webp", "assets/sheets/GJ_GameSheet.json");
      this.load.atlas("GJ_GameSheet02", "assets/sheets/GJ_GameSheet02.webp", "assets/sheets/GJ_GameSheet02.json");
      this.load.atlas("GJ_GameSheet03", "assets/sheets/GJ_GameSheet03.webp", "assets/sheets/GJ_GameSheet03.json");
      this.load.atlas("GJ_GameSheet04", "assets/sheets/GJ_GameSheet04.webp", "assets/sheets/GJ_GameSheet04.json");
      this.load.atlas("GJ_GameSheetEditor", "assets/sheets/GJ_GameSheetEditor.webp", "assets/sheets/GJ_GameSheetEditor.json");
      this.load.atlas("GJ_GameSheetGlow", "assets/sheets/GJ_GameSheetGlow.webp", "assets/sheets/GJ_GameSheetGlow.json");
      this.load.atlas("GJ_GameSheetIcons", "assets/sheets/GJ_GameSheetIcons.webp", "assets/sheets/GJ_GameSheetIcons.json");
      this.load.atlas("Wavesheet", "assets/sheets/Wavesheet.webp", "assets/sheets/Wavesheet.json");
      this.load.json("Spider_AnimDesc", "assets/sheets/Spider_AnimDesc.json");
      this.load.json("Robot_AnimDesc", "assets/sheets/Robot_AnimDesc.json");
      this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.webp", "assets/sheets/GJ_LaunchSheet.json");
      this.load.atlas("player_ball_00", "assets/sheets/player_ball_00.webp", "assets/sheets/player_ball_00.json");
      this.load.atlas("player_dart_00", "assets/sheets/player_dart_00.webp", "assets/sheets/player_dart_00.json");
      this.load.atlas("CCControlColourPickerSpriteSheet-uhd", "assets/sheets/CCControlColourPickerSpriteSheet-uhd.webp", "assets/sheets/CCControlColourPickerSpriteSheet-uhd.json");
      this.load.atlas("PixelSheet_01-hd", "assets/sheets/PixelSheet_01.webp", "assets/sheets/PixelSheet_01.json");
      this.load.atlas("FireSheet_01-hd", "assets/sheets/FireSheet_01-hd.webp", "assets/sheets/FireSheet_01-hd.json");
      this.load.atlas("GJ_ParticleSheet-uhd", "assets/sheets/GJ_ParticleSheet.webp", "assets/sheets/GJ_ParticleSheet.json");
      this.load.image("bigFont", "assets/fonts/bigFont.webp");
      this.load.text("bigFontFnt", "assets/fonts/bigFont.fnt");
      this.load.image("square04_001", "assets/sprites/square04_001.webp");
      this.load.image("GJ_square02", "assets/sprites/GJ_square02.webp");
      this.load.image("GJ_square01", "assets/sprites/GJ_square01.webp");
      this.load.image("square01_001", "assets/sprites/square01_001.webp");
      this.load.image("loadingCircle", "assets/sprites/loadingCircle.webp");
    this.load.image("btn_whatsapp", "assets/sprites/btn_whatsapp.webp");
    this.load.image("btn_discord", "assets/sprites/btn_discord.webp");
      this.load.image("GJ_button01", "assets/sprites/GJ_button_01.webp");
      this.load.image("GJ_button02", "assets/sprites/GJ_button_02.webp");
      this.load.image("GJ_button03", "assets/sprites/GJ_button_03.webp");
      this.load.image("GJ_button04", "assets/sprites/GJ_button_04.webp");
      this.load.image("GJ_button05", "assets/sprites/GJ_button_05.webp");
      this.load.image("GJ_button06", "assets/sprites/GJ_button_06.webp");
      this.load.image("import", "assets/sprites/import.webp");
      this.load.image("export", "assets/sprites/export.webp");
      this.load.image("tutorial_01", "assets/sprites/tutorial_01.webp");
      this.load.image("tutorial_02", "assets/sprites/tutorial_02.webp");
      this.load.image("tutorial_03", "assets/sprites/tutorial_03.webp");
      this.load.image("tutorial_04", "assets/sprites/tutorial_04.webp");
      this.load.image("tutorial_05", "assets/sprites/tutorial_05.webp");
      this.load.image("tab1", "assets/sprites/tab1.webp");
      this.load.image("tab2", "assets/sprites/tab2.webp");
      this.load.image("tab3", "assets/sprites/tab3.webp");
      this.load.image("tab4", "assets/sprites/tab4.webp");
      this.load.image("tab5", "assets/sprites/tab5.webp");
      this.load.image("tab6", "assets/sprites/tab6.webp");
      this.load.image("tab7", "assets/sprites/tab7.webp");
      this.load.image("tab8", "assets/sprites/tab8.webp");
      this.load.image("GJ_moveBtn", "assets/sprites/GJ_moveBtn.webp");
      this.load.image("GJ_moveSBtn", "assets/sprites/GJ_moveSBtn.webp");
      this.load.image("slidergroove2", "assets/sprites/slidergroove2.webp");
      this.load.image("macroBot", "assets/sprites/macroBot.webp");
      this.load.image("importMacro", "assets/sprites/importMacro.webp");
      this.load.image("playbackMacro", "assets/sprites/playbackMacro.webp");
      this.load.image("stopPlayback", "assets/sprites/stopPlayback.webp");
      this.load.image("recordMacro", "assets/sprites/recordMacro.webp");
      this.load.image("stopRecord", "assets/sprites/stopRecord.webp");

      for (let i = 1; i < 23; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        let paddedIndex = String(index);
        if (paddedIndex.length < 2) paddedIndex = "0" + paddedIndex;
        this.load.image("groundSquare_" + paddedIndex + "_001.png", "assets/game-ground/groundSquare_" + i + "_001.webp");
        // La capa de detalle _2 solo existe a partir del cuadro 08.
        // Cargarla para los anteriores generaba 404 y texturas rotas.
        if (Number(i) >= 8) {
          this.load.image("groundSquare_" + paddedIndex + "_2_001.png", "assets/game-ground/groundSquare_" + i + "_2_001.webp");
        }
      }

      // Los 59 fondos ya NO se cargan aca: pesan ~3.9 MB y en el menu solo
      // se usa el 01. El resto se pide bajo demanda al entrar a un nivel
      // (ver _ensureBackgroundTexture en game-scene.js), asi el arranque
      // baja de ~13 MB a ~9 MB.

      this.load.audio("menu_music", "assets/music/menuLoop.mp3");
      this.load.audio("StayInsideMe", "assets/music/StayInsideMe.mp3");

      /*for (const lvlarray of window.allLevels) {
        this.load.text(lvlarray[2], "assets/levels/" + lvlarray[2].split("_")[1] + ".txt");
        this.load.audio(lvlarray[0], "assets/music/" + (lvlarray[4] ? lvlarray[4] : lvlarray[1].replaceAll(" ", "")) + ".mp3");
      }*/

      this.load.audio("explode_11", "assets/sfx/explode_11.ogg");
      this.load.audio("endStart_02", "assets/sfx/endStart_02.ogg");
      this.load.audio("gold02", "assets/sfx/gold02.ogg");
      this.load.audio("playSound_01", "assets/sfx/playSound_01.ogg");
      this.load.audio("quitSound_01", "assets/sfx/quitSound_01.ogg");
      this.load.audio("highscoreGet02", "assets/sfx/highscoreGet02.ogg");

      this.load.on("progress", (value) => {
        if (sliderFill) sliderFill.width = value * 380;
      });

      // Conexiones de celular flojas pierden algun request de vez en cuando.
      // Antes esto se ignoraba en silencio y la carga quedaba trabada con la
      // barra a mitad de camino. Ahora reintentamos un par de veces por
      // archivo y, si de verdad no hay forma, avisamos en vez de colgar.
      const _retryCounts = new Map();
      const _failedFiles = [];
      const MAX_RETRIES = 2;
      this.load.on("loaderror", (file) => {
        const retries = _retryCounts.get(file.key) || 0;
        if (retries < MAX_RETRIES) {
          _retryCounts.set(file.key, retries + 1);
          console.warn(`[load] reintentando "${file.key}" (${retries + 1}/${MAX_RETRIES})`, file.src);
          file.resetXHR();
          this.load.addFile(file);
        } else {
          console.error(`[load] no se pudo cargar "${file.key}"`, file.src);
          _failedFiles.push(file.key);
        }
      });

      this.load.once("complete", () => {
        if (sliderFill) sliderFill.width = 380;
        this.time.delayedCall(200, () => {
          const bigFontData = this.cache.text.get("bigFontFnt");
          if (bigFontData) loadFont(this, "bigFont", bigFontData);
          const gfd = this.cache.text.get("goldFontFnt");
          if (gfd && !this.cache.bitmapFont.has("goldFont")) loadFont(this, "goldFont", gfd);

          if (_failedFiles.length > 0) {
            console.error("[load] archivos que no cargaron despues de reintentar:", _failedFiles);
            const warnMsg = this.add.bitmapText(cx, cy + 220, "goldFont",
              "Algunos archivos no cargaron. Si el juego se ve raro, recarga la pagina.", 18)
              .setOrigin(0.5).setDepth(999);
            this.time.delayedCall(6000, () => warnMsg.destroy());
          }

          localStorage.setItem('webdash_assets_loaded', 'true');
          localStorage.setItem('webdash_last_load_time', Date.now().toString());
          this.scene.start("GameScene");
        });
      });

      this.load.start();
    });
  }
  create() {
  }
}
