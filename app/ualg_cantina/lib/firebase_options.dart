// lib/firebase_options.dart

class FirebaseOptions {
  final String apiKey;
  final String authDomain;
  final String projectId;
  final String storageBucket;
  final String messagingSenderId;
  final String appId;

  const FirebaseOptions({
    required this.apiKey,
    required this.authDomain,
    required this.projectId,
    required this.storageBucket,
    required this.messagingSenderId,
    required this.appId,
  });
}

class DefaultFirebaseOptions {
  static const web = FirebaseOptions(
    apiKey: "AIzaSyBNnTxESatobQsRYU9U6khUpnZ3L_S3Y8Q",
    authDomain: "ualg-cantina.firebaseapp.com",
    projectId: "ualg-cantina",
    storageBucket: "ualg-cantina.appspot.com",
    messagingSenderId: "820778911723",
    appId: "1:820778911723:web:8ce8863f78670ccd5d3bae",
  );
}
