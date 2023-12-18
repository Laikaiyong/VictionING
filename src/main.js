import kaboom from "kaboom";
import { MetaMaskSDK } from '@metamask/sdk';
import { TomochainTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

function movement() {
  const { vec2, dt } = k;
  const direction = vec2(0, 0);
  const speed = 16;
  let accumulatedTime = 0;

  return {
    add() {
      this.movement.right();
    },
    update() {
      accumulatedTime += dt();

      if (accumulatedTime < 0.25) {
        return;
      }

      accumulatedTime = 0;

      if (!this.pos) {
        console.error("missing pos component");
        return;
      }

      this.pos.x += direction.x * speed;
      this.pos.y += direction.y * speed;

      const child = this.getChild();
      if (!child) {
        return;
      }

      child.moveUpdate(this.pos.x, this.pos.y);
    },
    movement: {
      left() {
        direction.x = -1;
        direction.y = 0;
      },
      right() {
        direction.x = 1;
        direction.y = 0;
      },
      up() {
        direction.x = 0;
        direction.y = -1;
      },
      down() {
        direction.x = 0;
        direction.y = 1;
      },
    },
  };
}

const k = kaboom({
	width: 1280,
	height: 1000,
	letterbox: true,
	debug: false,
	background: [223, 221, 214]
})

k.loadSprite("game-logo", "images/logo.png")
k.loadSprite("background", "sprites/floor.png")
k.loadSprite("npc1", "sprites/npc1.png")
k.loadSprite("npc2", "sprites/npc2.png")
k.loadSprite("ghosty", "sprites/ghosty.png")
k.loadSprite("grass", "sprites/grass.png")
k.loadSprite("steel", "sprites/steel.png")
k.loadSprite("door", "sprites/door.png")
k.loadSprite("pubkey", "sprites/publickey.png")
k.loadSprite("prikey", "sprites/privatekey.png")
k.loadSprite("hero", "sprites/hero.png")
k.loadSprite("wallet-win", "images/walletkeys.png")
k.loadSprite("star", "sprites/star.png")
k.loadSprite("metamask", "images/metamask.png");
k.loadSprite("tomochain", "images/tomochain.png");

// k.add([
// 	k.sprite("background"),
// 	k.pos(width() / 2, height() / 2),
// 	k.scale(4),
// 	k.origin("center"),
//     k.fixed()
// ])


k.scene('start', () => {
  keysHeld = [];
  k.add([
    k.sprite("game-logo", {
      width: 280,
      height: 280,
    }),
    k.area(),
    k.body({ isStatic: true }),
    k.anchor("center"),
    k.pos(k.width() / 2, k.height() / 5),
  ]);
  k.add([
    k.color(29, 29, 29),
    k.text("Game Menu", {
      width: k.width(),
      height: k.height(),
    }),
    k.pos(k.width() / 2.34, k.height() / 3.1),
  ]);
  k.add([
    k.color(102, 102, 102),
    k.text("Coming Soon", {
      width: k.width(),
      height: k.height(),
    }),
    k.pos(k.width() / 2.4, k.height() / 1.3),
  ]);
  // const guide = k.add([
  //   k.color(100, 100, 100),
  //   k.text('Guide Journey', {
  // 	width: k.width(),
  // 	height: k.height(),
  //   }),
  //   k.pos(k.width() / 2.4, k.height() / 1.2),
  // ]);

  // guide.onClick(() => {
  // 	k.burp();
  // 	k.go("guide");
  // });

  // NFT
  k.add([k.pos(850, 570), k.text("NFT"), k.color(29, 29, 29)]);

  const selectStory2 = k.add([
    k.rect(200, 200, {
      fill: true,
    }),
    k.area(),
    k.pos(780, 500),
    k.outline(),
    k.body(),
    k.opacity(0.1),
  ]);

  selectStory2.onClick(() => {
    k.burp();
    // k.go("wallet", 1);
  });

  // Airdrop
  k.add([k.pos(580, 570), k.text("Airdrop"), k.color(29, 29, 29)]);

  const selectStory3 = k.add([
    k.rect(200, 200, {
      fill: true,
    }),
    k.area(),
    k.pos(550, 500),
    k.outline(),
    k.body(),
    k.opacity(0.1),
  ]);

  selectStory3.onClick(() => {
    k.burp();
    k.go("airdrop", 0);
  });

  // Wallet
  k.add([k.pos(360, 570), k.text("Wallet"), k.color(29, 29, 29)]);

  const selectStory1 = k.add([
    k.rect(200, 200, {
      fill: true,
    }),
    k.area(),
    k.pos(320, 500),
    k.outline(),
    k.body(),
    k.opacity(0.1),
  ]);

  selectStory1.onClick(() => {
    k.burp();
    k.go("wallet", 0);
  });

  k.add([
    k.color(29, 29, 29),
    k.text("Press space to begin!", {
      width: k.width(),
      height: k.height(),
    }),
    k.pos(k.width() / 3, k.height() / 2.5),
  ]);

  onKeyPress("space", () => {
    k.burp();
    k.go("wallet", 0);
  });
});
  
k.scene("wallet", (levelIdx) => {
	k.onClick(() => k.addKaboom(k.mousePos()))

	const SPEED = 320

	// character dialog data
	const characters = {
		"a": {
			sprite: "npc1",
			msg: "Find your public key",
		},
		"b": {
			sprite: "npc2",
			msg: "Get the private key",
		},
	}

	// level layouts
	const levels = [
		[
			"===|============",
			"=              =",
			"= $            =",
			"=    a         =",
			"=              =",
			"=              =",
			"=              =",
			"=  =======     =",
			"=  =           =",
			"=  = @         =",
			"================",
		],
		[
			"-----------------",
			"-               -",
			"-               -",
			"-               -",
			"-   *           -",
			"|               -",
			"-    b          -",
			"-  @            -",
			"-----------------",
		],
	]

	const level = k.addLevel(levels[levelIdx], {
		tileWidth: 64,
		tileHeight: 64,
		pos: k.vec2(64, 64),
		tiles: {
			"=": () => [
				k.sprite("grass"),
				k.area(),
				k.body({ isStatic: true }),
				k.anchor("center"),
			],
			"-": () => [
				k.sprite("steel"),
				k.area(),
				k.body({ isStatic: true }),
				k.anchor("center"),
			],
			"$": () => [
				k.sprite("pubkey"),
				k.area(),
				k.anchor("center"),
				"key",
			],
			"*": () => [
				k.sprite("prikey"),
				k.area(),
				k.anchor("center"),
				"key",
			],
			"@": () => [
				k.sprite("hero"),
				k.area(),
				k.body(),
				k.anchor("center"),
				"player",
			],
			"|": () => [
				k.sprite("door"),
				k.area(),
				k.body({ isStatic: true }),
				k.anchor("center"),
				"door",
			],
		},
		// any() is a special function that gets called everytime there's a
		// symbole not defined above and is supposed to return what that symbol
		// means
		wildcardTile(ch) {
			const char = characters[ch]
			if (char) {
				return [
					k.sprite(char.sprite),
					k.area(),
					k.body({ isStatic: true }),
					k.anchor("center"),
					"character",
					{ msg: char.msg },
				]
			}
		},
	})

	// get the player game obj by tag
	const player = level.get("player")[0]

	function addDialog() {
		const h = 160
		const pad = 16
		const bg = k.add([
			k.pos(0, k.height() - h),
			k.rect(k.width(), h),
			k.color(0, 0, 0),
			k.z(100),
		])
		const txt = k.add([
			k.text("", {
				width: k.width(),
			}),
			k.pos(0 + pad, k.height() - h + pad),
			k.z(100),
		])
		bg.hidden = true
		txt.hidden = true
		return {
			say(t) {
				txt.text = t
				bg.hidden = false
				txt.hidden = false
			},
			dismiss() {
				if (!this.active()) {
					return
				}
				txt.text = ""
				bg.hidden = true
				txt.hidden = true
			},
			active() {
				return !bg.hidden
			},
			destroy() {
				bg.destroy()
				txt.destroy()
			},
		}
	}

	let hasKey = false
	const dialog = addDialog()

	player.onCollide("key", (key) => {
		destroy(key)
		hasKey = true
	})

	player.onCollide("door", () => {
		k.shake()
		if (hasKey) {
			if (levelIdx + 1 < levels.length) {
				k.go("wallet", levelIdx + 1)
			} else {
				k.go("wallet-win")
			}
		} else {
			dialog.say("you got no key!")
		}
	})

	// talk on touch
	player.onCollide("character", (ch) => {
		dialog.say(ch.msg)
	})

	const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
	}

	for (const dir in dirs) {
		onKeyPress(dir, () => {
			dialog.dismiss()
		})
		onKeyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED))
		})
	}

})

//TODO
k.scene("airdrop", (levelIdx) => {
  k.onClick(() => k.addKaboom(k.mousePos()));

  const SPEED = 320;

  // character dialog data
  const characters = {
    a: {
      sprite: "npc1",
      msg: "Hai",
    },
    b: {
      sprite: "npc2",
      msg: "Get the private key",
    },
  };

  const wallet = k.add([
	  k.sprite("metamask"),
	  k.area(),
	  k.body({ isStatic: true }),
	  k.anchor("center"),
	  k.pos(k.width() / 3, k.height() / 5)
  ])
  wallet.onClick(async () => {
	try {
    if (window.ethereum) {
 
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // window.web3 = new Web3(window.ethereum);
      k.add([
        k.color(29, 29, 29),
        k.text(window.ethereum.selectedAddress, {
        width: k.width(),
        height: k.height(),
        }),
        k.pos(k.width() / 4, k.height() / 4),
      ])
      
     } else {
      console.log("No wallet");
     }
  } catch (error) {
    // user rejects the request to "add chain" or param values are wrong, maybe you didn't use hex above for `chainId`?
    console.log(`Error: ${error.message}`)
  }})

  k.add([
	  k.text("Airdrop"),
    k.color(29, 29, 29),
	  k.area(),
	  k.body({ isStatic: true }),
	  k.anchor("center"),
	  k.pos(k.width() / 3, k.height() / 3.9)
  ])
  const airdrop = k.add([
	  k.sprite("tomochain"),
	  k.area(),
	  k.body({ isStatic: true }),
	  k.anchor("center"),
	  k.pos(k.width() / 3, k.height() / 3.3)
  ])
  airdrop.onClick(async () => {
	try {
    const sdk = new ThirdwebSDK(TomochainTestnet, {
      clientId: "74f4385f3be3a301460ee15bb7925a0b",
    });
    const contract = await sdk.getContract("0x73D43d99866A8545c3a19C7Ca0E3Ec9Ca13cb030");
    const sercretKey ="Io41-dzIYbi0znChMxkTSnfDk3iOTPKYJWLe4ZIVyLCyxNDtMZJU7BIOXxJocx2f7bBuJ0Syr-j4JRpmaZSWmQ";
  } catch (error) {
    // user rejects the request to "add chain" or param values are wrong, maybe you didn't use hex above for `chainId`?
    console.log(`Error: ${error.message}`)
  }


	// const MMSDK = new MetaMaskSDK();
	// MMSDK.init();
	// const ethereum = MMSDK.getProvider(); 
	k.burp();
	// ethereum.request({ method: 'eth_requestAccounts', params: [] });
})

  // level layouts
  const levels = [
    [
      "=================",
      "= * * * * * * * =",
      "=               =",
      "=               =",
      "=               =",
      "=               =",
      "=               =",
      "=               =",
      "=               =",
      "=       @       =",
      "========|========",
    ],
    [
      "-----------------",
      "-               -",
      "-               -",
      "-               -",
      "-   *           -",
      "|               -",
      "-    b          -",
      "-  @            -",
      "-----------------",
    ],
  ];

  const level = k.addLevel(levels[levelIdx], {
    tileWidth: 64,
    tileHeight: 64,
    pos: k.vec2(64, 64),
    tiles: {
      "=": () => [
        k.sprite("grass"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
		"grass"
      ],
      "-": () => [
        k.sprite("steel"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
      ],
      $: () => [k.sprite("pubkey"), k.area(), k.anchor("center"), "key"],
      "*": () => [k.sprite("star"), k.move(90, 220), k.area(), k.anchor("center"), "star"],
      "@": () => [
        k.sprite("hero"),
        k.area(),
        k.body(),
        k.anchor("center"),
        "player",
      ],
      "|": () => [
        k.sprite("door"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
        "door",
      ],
	  
    },
    // any() is a special function that gets called everytime there's a
    // symbole not defined above and is supposed to return what that symbol
    // means
    wildcardTile(ch) {
      const char = characters[ch];
      if (char) {
        return [
          k.sprite(char.sprite),
          k.area(),
          k.body({ isStatic: true }),
          k.anchor("center"),
          "character",
          { msg: char.msg },
        ];
      }
    },
  });

  // get the player game obj by tag
  const player = level.get("player")[0];
  const grass = level.get("grass");

  function addDialog() {
    const h = 160;
    const pad = 16;
    const bg = k.add([
      k.pos(0, k.height() - h),
      k.rect(k.width(), h),
      k.color(0, 0, 0),
      k.z(100),
    ]);
    const txt = k.add([
      k.text("", {
        width: k.width(),
      }),
      k.pos(0 + pad, k.height() - h + pad),
      k.z(100),
    ]);
    bg.hidden = true;
    txt.hidden = true;
    return {
      say(t) {
        txt.text = t;
        bg.hidden = false;
        txt.hidden = false;
      },
      dismiss() {
        if (!this.active()) {
          return;
        }
        txt.text = "";
        bg.hidden = true;
        txt.hidden = true;
      },
      active() {
        return !bg.hidden;
      },
      destroy() {
        bg.destroy();
        txt.destroy();
      },
    };
  }

  let hasKey = false;
  let starCount = 0;
  const dialog = addDialog();

  player.onCollide("key", (key) => {
    destroy(key);
    hasKey = true;
  });

  player.onCollide("star", (star) => {
    destroy(star);
    starCount++;
  });

  grass.forEach((g) => g.onCollide("star", (item) => {
	destroy(item);
  }));

  // player.onCollide("door", () => {
  //   k.shake();
  //   if (hasKey) {
  //     if (levelIdx + 1 < levels.length) {
  //       k.go("wallet", levelIdx + 1);
  //     } else {
  //       k.go("wallet-win");
  //     }
  //   } else {
  //     dialog.say("you got no key!");
  //   }
  // });

  // talk on touch
  player.onCollide("character", (ch) => {
    dialog.say(ch.msg);
  });

  const dirs = {
    left: LEFT,
    right: RIGHT,
    up: UP,
    down: DOWN,
  };

  for (const dir in dirs) {
    onKeyPress(dir, () => {
      dialog.dismiss();
    });
    onKeyDown(dir, () => {
      player.move(dirs[dir].scale(SPEED));
    });
  }
});

k.scene("wallet-win", () => {
	k.add([
		k.sprite("wallet-win"),
		k.pos(k.width() / 2, k.height() / 2),
		k.anchor("center"),
	])

	// const selectStory1 = k.add([
	// 	k.rect(200, 200, {
	// 		fill: true
	// 	}),
	// 	k.area(),
	// 	k.pos(320, 500),
	// 	k.outline(),
	// 	k.body(),
	// 	k.opacity(0.1),
	// ]);

	// selectStory1.onClick(() => {
	// 	k.burp();
	// 	k.go("wallet", 0);
	// });

	k.add([
	  k.color(29, 29, 29),
	  k.text('Press space to return', {
		width: k.width(),
		height: k.height(),
	  }),
	  k.pos(k.width() / 3, k.height() / 1.2),
	]);


	onKeyPress("space", () => {
		k.burp();
		k.go("start");
	  });
})

k.scene("win", () => {
	k.add([
		k.sprite("wallet-win"),
		k.pos(k.width() / 2, k.height() / 2),
		k.anchor("center"),
	])
})

k.go("start")
