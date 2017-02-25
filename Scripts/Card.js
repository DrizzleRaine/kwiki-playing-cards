// define a user behaviour
var Card = qc.defineBehaviour('qc.engine.Card', qc.Behaviour, function() {
    this.face = null;
    this.faceVisible = false;
    this.flippingCard = false;
    this.croupier = null;
}, {
    // fields need to be serialized
    face: qc.Serializer.TEXTURE,
    croupier: qc.Serializer.NODE
});

// Called when the script instance is being loaded.
Card.prototype.awake = function() {
    if (this.face) {
		this.gameObject.find('Face').texture = this.face;
    }
    this.tweenScale = this.gameObject.getScript('qc.TweenScale');
    this.tweenPosition = this.gameObject.getScript('qc.TweenPosition');
    this.faceNode = this.gameObject.find('Face');
    this.croupier = this.croupier ||  this.gameObject.parent;
    var self = this;
    
    this.tweenScale.onFinished.add(function() {
        self.flippingCard = false;
        self.faceVisible = !self.faceVisible;
        self.croupier.Croupier.compare();
    });
    
    this.tweenPosition.onFinished.add(function() {
        self.flippingCard = false;
        self.faceVisible = false;
        self.gameObject.visible = false;
        self.croupier.Croupier.compare();
    });    
};

Card.prototype.sameCard = function(card) {
	return this.faceNode.texture.atlas.key === card.Card.faceNode.texture.atlas.key;
};

Card.prototype.onClick = function() {
	if (this.faceVisible) return;
    if (this.croupier.Croupier.visibleCards.length >=2 ) return;
  
	this.flipCard(); 
};

Card.prototype.flipCard = function() {
    var self = this;
    if (this.flippingCard) {
        this.game.timer.add((this.tweenScale.duration * 1000) + 500, function() {
            self.flipCard();  
        });
        return;
    }
    this.flippingCard = true;
    
    if (this.gameObject.scaleX < 0 )
        this.tweenScale.playReverse();
	else
        this.tweenScale.playForward();
    this.game.timer.add((this.tweenScale.duration / 2) * 1000, function() {
        self.faceNode.visible = !self.faceNode.visible;
        self.faceNode.anchorX = 70;
    });    
};

Card.prototype.removeCard = function() {
    this.tweenPosition.from = new qc.Point(this.gameObject.x,this.gameObject.y);
    this.tweenPosition.to = new qc.Point(-200,-200);
    this.tweenPosition.playForward();    
};
