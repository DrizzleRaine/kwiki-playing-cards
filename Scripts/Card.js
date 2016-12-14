// define a user behaviour
var Card = qc.defineBehaviour('qc.engine.Card', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.face = null;
    this.faceVisible = false;
}, {
    // fields need to be serialized
    face: qc.Serializer.TEXTURE
});

// Called when the script instance is being loaded.
Card.prototype.awake = function() {
    if (this.face) {
		this.gameObject.find('Face').texture = this.face;
    }
};

// Called every frame, if the behaviour is enabled.
//Card.prototype.update = function() {
//
//};

Card.prototype.onClick = function() {
    /*this.game.timer.add((scaleTween.duration / 2) * 1000, function() {
        face.visible = !face.visible;
    });*/    
	if (this.faceVisible) return;
    
	var holder = this.gameObject.parent.getScript('qc.engine.CardHolder');
    holder.updateVisibles();
	this.flipCard();      
    holder.checkCards();
    
  
};

Card.prototype.flipCard = function() {
    this.faceVisible = !this.faceVisible;
    var scaleTween = this.gameObject.getScript('qc.TweenScale');
    var face = this.gameObject.find('Face');

    if (this.gameObject.scaleX < 0 )
        scaleTween.playReverse();
	else
        scaleTween.playForward();
    
    this.game.timer.add((scaleTween.duration / 2) * 1000, function() {
        face.visible = !face.visible;
    });
};

Card.prototype.resetCard = function() {
    var scaleTween = this.gameObject.getScript('qc.TweenScale');
    scaleTween.stop();
    scaleTween.resetToBeginning();
    var face = this.gameObject.find('Face');
	face.visible = false;
    this.faceVisible = false;
    
};

