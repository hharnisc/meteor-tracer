Tracer = new Meteor.Collection("tracer");
var colors = ['red', 'yellow', 'green', 'blue'];
if (Meteor.isClient) {
  Meteor.startup(function () {
    // create a tracer off screen
    var now = (new Date()).getTime();
    var randIdx = Math.floor(Math.random() * colors.length);
    tracer_id = Tracer.insert({x: -100, y: -100, last_seen: now, color: colors[randIdx]});
    Session.set('tracer_id', tracer_id);
  });

  Template.display.events({
    'mousemove' : function(ev) {
      var now = (new Date()).getTime();
      tracer = Tracer.findOne(Session.get('tracer_id'));
      // tracer has already been added to database
      if (tracer) {
        Tracer.update(Session.get('tracer_id'), {x: ev.x, y: ev.y, last_seen: now, color: tracer.color});
      } else {
      // session was created -- insert a new record with old tracer id
        var randIdx = Math.floor(Math.random() * colors.length);
        tracer = Tracer.insert({_id: Session.get('tracer_id'), x: ev.x, y: ev.y, last_seen: now, color: colors[randIdx]});
      }
    }
  });

  Template.display.tracers = function () {
    return Tracer.find({});
  };
}

if (Meteor.isServer) {
  //clean up any tracers who haven't moved for 20 seconds
  Meteor.setInterval(function () {
    var now = (new Date()).getTime();
    Tracer.remove({last_seen: {$lt: (now - 20 * 1000)}});
  }, 5000);

}
