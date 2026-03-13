import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type RecordingId = Nat;

  type Recording = {
    id : RecordingId;
    title : Text;
    url : Text;
    desc : ?Text;
    tag : Text;
    created : Time.Time;
  };

  module Recording {
    public func compare(x : Recording, y : Recording) : Order.Order {
      Int.compare(x.created, y.created);
    };
  };

  var counter = 0;

  let recordings = Map.empty<RecordingId, Recording>();

  public shared ({ caller }) func addRecording(title : Text, url : Text, desc : ?Text, tag : Text) : async RecordingId {
    let id = counter;
    counter += 1;
    let recording : Recording = {
      id;
      title;
      url;
      desc;
      tag;
      created = Time.now();
    };
    recordings.add(id, recording);
    id;
  };

  public query ({ caller }) func getRecording(id : RecordingId) : async Recording {
    switch (recordings.get(id)) {
      case (null) { Runtime.trap("Recording not found") };
      case (?recording) { recording };
    };
  };

  public query ({ caller }) func getAllRecordings() : async [Recording] {
    recordings.values().toArray().sort();
  };

  public shared ({ caller }) func removeRecording(id : RecordingId) : async () {
    if (not recordings.containsKey(id)) {
      Runtime.trap("Recording not found");
    };
    recordings.remove(id);
  };

  public query ({ caller }) func getRecordingsByTag(tag : Text) : async [Recording] {
    recordings.values().toArray().sort().filter(
      func(recording) {
        recording.tag == tag;
      }
    );
  };

  public shared ({ caller }) func updateRecording(id : RecordingId, title : Text, url : Text, desc : ?Text, tag : Text) : async () {
    switch (recordings.get(id)) {
      case (null) { Runtime.trap("Recording not found") };
      case (?existing) {
        let updated : Recording = {
          id;
          title;
          url;
          desc;
          tag;
          created = existing.created;
        };
        recordings.add(id, updated);
      };
    };
  };
};
