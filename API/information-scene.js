var InformationScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
      Phaser.Scene.call(this, { key: "InformationScene" });
  },
  init: function (data) {
    this.location = data.location;
},
  preload: function () {
    this.load.html("form", "form.html");
   },
  create: async function () {
    this.usernameInput = this.add.dom(640, 360).createFromCache("form");

    this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.returnKey.on("down", event => {

        let username = this.usernameInput.getChildByName("username");

        if(username.value != "") {

            // Switch scene ...

        }
        this.locationText = this.add.text(
          640, 
          425, 
          `[${this.location.coordinates[1]}, ${this.location.coordinates[0]}]`,
          {
              fontSize: 20
          }
      ).setOrigin(0.5);
    })
    this.returnKey.on("down", event => {
      let username = this.usernameInput.getChildByName("username");
      if(username.value != "") {
          this.scene.start("MainScene", { username: username.value, score: 0, location: this.location });
      }
  })
   },
  update: function () { }
});