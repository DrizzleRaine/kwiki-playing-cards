// define a user behaviour
var Croupier = qc.defineBehaviour('qc.engine.Croupier', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.visibleCards = [];
    this.prevVisibleCards = [];
}, {
    // fields need to be serialized
    feedbackText: qc.Serializer.NODE,
    cardPrefab: qc.Serializer.PREFAB
});

Croupier.prototype.awake = function() {
    this.createCards();
};

Croupier.prototype.checkCards = function() {
    var self = this;
    this.prevVisibleCards = this.visibleCards;
    this.visibleCards = [];
	this.gameObject.children.forEach(function(card) {
        if (card.Card.faceVisible) {
            self.visibleCards.push(card);
        }
    });
};

Croupier.prototype.createCards = function() {
    //this.gameObject.removeChildren();
    for (i = 0; i < 20; i++) { 
        this.game.add.clone(this.cardPrefab, this.gameObject);
    }
    
	var self = this;
    this.game.timer.add(100, function() {
            self.gameObject.getScript('qc.TableLayout').destroy();
        });    
};

Croupier.prototype.compare = function() {
	this.checkCards();
    if (this.visibleCards.length === 0) return;
    if (this.visibleCards.length === 2) {
        var card1 = this.visibleCards[0];
        var card2 = this.visibleCards[1];
        var self = this;
        if (card1.Card.sameCard(card2)) {
            this.game.timer.add(500, function() {
				card1.Card.removeCard();
				card2.Card.removeCard();
            });         
		} else {
			this.game.timer.add(500, function() {
				card1.Card.flipCard();
				card2.Card.flipCard();
			});
        }
    }
};