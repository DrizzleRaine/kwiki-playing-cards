// define a user behaviour
var CardHolder = qc.defineBehaviour('qc.engine.CardHolder', qc.Behaviour, function() {
    // need this behaviour be scheduled in editor
    //this.runInEditor = true;
    this.visibles = [];
}, {
    // fields need to be serialized
});

// Called when the script instance is being loaded.
//CardHolder.prototype.awake = function() {
//
//};

// Called every frame, if the behaviour is enabled.
//CardHolder.prototype.update = function() {
//
//};

CardHolder.prototype.sameCards = function(card1, card2) {
    
	return card1.find('Face').texture.atlas.key === card2.find('Face').texture.atlas.key;
};

CardHolder.prototype.updateVisibles = function() {
    var visibles = this.visibles;
    this.gameObject.children.forEach(function(card) {
        var script = card.getScript('qc.engine.Card');
        if (script.faceVisible && visibles.indexOf(card) == -1) {
            visibles.push(card);
        }
    });
};

CardHolder.prototype.checkCards = function() {
    var visibles = this.visibles;
    var self = this;
    var skipVisibleCheck = false;
    visibles.forEach(function(a) {
        visibles.forEach(function(b) {
            if (!Object.is(a, b) && self.sameCards(a, b)) {
                var tweenA = a.getScript('qc.TweenScale');
                var tweenB = b.getScript('qc.TweenScale');
                tweenA.to = new qc.Point(0,0);
                tweenA.from = new qc.Point(1,1);
                tweenA.play();
                tweenB.to = tweenA.to;
                tweenB.from = tweenB.from;
                tweenB.play();
                delete visibles[visibles.indexOf(a)];
                delete visibles[visibles.indexOf(b)];
                skipVisibleCheck = true;
            } 
        });        
    });
    if (skipVisibleCheck) return;
    
    if (visibles.length > 1) {
		visibles.forEach(function(card, i, list) {
			var script = card.getScript('qc.engine.Card');
            script.resetCard();
        });
        visibles.length = 0;
    }    
};