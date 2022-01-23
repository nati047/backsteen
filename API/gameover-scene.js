var GameOverScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
      Phaser.Scene.call(this, { key: "GameOverScene" });
  },
  init: function(data) {
      this.player = data;
  },
  preload: function() {},
  create: async function() {
    try {

        // REST API logic ...

        this.add.text(10, 100, "GLOBAL HIGH SCORES", { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });
        this.add.text(600, 100, "NEARBY HIGH SCORES", { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });

        this.add.text(10, 10, "YOUR SCORE: " + this.player.score, { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });

        for(let i = 0; i < this.globalScores.length; i++) {
            this.add.text(10, 100 * (i + 2), `${this.globalScores[i].username}: ${this.globalScores[i].score}`, { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });
        }

        for(let i = 0; i < this.nearbyScores.length; i++) {
            this.add.text(600, 100 * (i + 2), `${this.nearbyScores[i].username}: ${this.nearbyScores[i].score}`, { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });
        }

        this.retryButton = this.add.text(1125, 640, "RETRY", { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });
        this.retryButton.setInteractive();

        this.retryButton.on("pointerdown", () => {
            this.scene.start("MainScene", { username: this.player.username, score: 0, location: this.player.location });
        }, this);

    } catch (e) {
        console.error(e);
    }
},
  update: function() {}
});

this.retryButton = this.add.text(1125, 640, "RETRY", { fontSize: 40, color: '#000000', fontStyle: "bold", backgroundColor: "#FFFFFF", padding: 10 });
this.retryButton.setInteractive();

this.retryButton.on("pointerdown", () => {
    this.scene.start("MainScene", { username: this.player.username, score: 0, location: this.player.location });
}, this);