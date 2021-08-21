window.addEventListener("load", () => {
    const BopInfo = GenerateBopInfo();

    const elements = {
        loadButton: document.querySelector(".load-button"),
        menu: document.querySelector(".menu"),
        loading: document.querySelector(".loading"),
        main: document.querySelector(".main")
    };

    let mainAudio = null;
    let currentMusic = null;

    const sleep = d => new Promise(resolve => setTimeout(resolve, d));

    const displayBop = b => {
        const display = document.createElement("div");
        display.className = "main-key";

        const displayName = b.display || b.key;
        if (displayName.length > 1) display.classList.add("wide-key");

        display.innerHTML = displayName;

        elements.main.appendChild(display);
        setTimeout(() => elements.main.removeChild(display), 500);
    };

    const waitForKey = correctbop => new Promise(resolve => {
        const listener = e => {
            const bop = BopInfoPressed(BopInfo, e);
            if (bop && bop.id == correctbop.id) {
                displayBop(bop);
                e.preventDefault();
                cancel();
                resolve(true);
            }
        };

        window.addEventListener("keydown", listener);
        const cancel = () => window.removeEventListener("keydown", listener);

        setTimeout(() => {
            cancel();
            resolve(false);
        }, 1500);
    });

    const localScore = localStorage.getItem("high-score");
    let highScore = localScore ? parseInt(localScore) : -1;

    const readNumber = input => {
        const readBasic = n => playSprite("basic" + n);
        const readTens = async n => {
            const ten = Math.floor(n / 10) - 2;
            if (ten >= 0) await playSprite("tens" + ten);
            if (n % 10) await readBasic(n % 10);
        };
        const readHundreds = async n => {
            const hundred = Math.floor(n / 100) - 1;
            if (hundred >= 0) await playSprite("hundreds" + hundred);
            await readTens(n % 100);
        };
        const readThousands = async n => {
            await playSprite("thousand");
            await readHundreds(n % 1000);
        };

        if (input >= 1000) return readThousands(input);
        if (input >= 100) return readHundreds(input);
        if (input >= 20) return readTens(input);
        return readBasic(input);
    };

    const loseState = async (score) => {
        //console.log("loseState");
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
        }
        await playSprite("scratch");
        await playSprite(`lose${Math.floor(Math.random() * 6)}`);
        await sleep(300);
        await playSprite("yourScore");
        await readNumber(score);
        if (highScore > 0) {
            await sleep(300);
            await playSprite("highScore");
            await readNumber(highScore);
        }
        await sleep(600);
        awaitBopIt();
    };

    const playSprite = n => new Promise(resolve => mainAudio.once("end", resolve, mainAudio.play(n)));

    const runGame = async () => {
        let score = 0;
        await playSprite("musicShort");
        while (true) {
            currentMusic = mainAudio.play("musicLong");
            await sleep(300);
            const current = BopInfo[Math.floor(Math.random() * BopInfo.length)];
            //console.log(current);
            const readAudio = mainAudio.play(current.id);
            const success = await waitForKey(current);

            mainAudio.stop(readAudio);

            if (currentMusic)
                mainAudio.stop(currentMusic);
            //keypress sfx

            if (!success) {
                loseState(score);
                return;
            }

            score++;
        }
    };

    const awaitBopIt = () => {
        const audio = mainAudio.play("bopStart");
        const listener = e => {
            if (BopInfoPressed(BopInfo, e)) {
                mainAudio.stop(audio);
                runGame();
                window.removeEventListener("keydown", listener);
            }
        };
        window.addEventListener("keydown", listener);
    };

    elements.loadButton.addEventListener("click", () => {
        elements.menu.parentNode.removeChild(elements.menu);
        elements.loading.style.display = "block";

        // do all of the below after loading audio
        const spriteObject = {
            musicShort: [98559, 2069],
            musicLong: [100628, 8276, true],
            lose0: [85336, 868],
            lose1: [87235, 1482],
            lose2: [89638, 1150],
            lose3: [91329, 680],
            lose4: [92297, 1884],
            lose5: [94529, 1728],
            scratch: [108904, 869],
            yourScore: [96828, 1278],
            highScore: [83588, 1124],
            bopStart: [81712, 1211]
        };
        BopInfo.forEach(i => spriteObject[i.id] = i.sprite);
        const addNumberSprites = (n, s) => s.forEach((b, i) => spriteObject[n + i] = b);
        addNumberSprites("basic", MainNumberSprites.basic);
        addNumberSprites("tens", MainNumberSprites.tens);
        addNumberSprites("hundreds", MainNumberSprites.hundreds);
        spriteObject.thousand = MainNumberSprites.thousand;
        mainAudio = new Howl({
            src: ["funny.wav"],
            autoplay: false,
            volume: 1,
            sprite: spriteObject,
            onload: () => {
                elements.loading.parentNode.removeChild(elements.loading);
                elements.main.style.display = "block";

                //readNumber(12);
                //window.readthing = readNumber;
                awaitBopIt();
            }
        });
    });
});