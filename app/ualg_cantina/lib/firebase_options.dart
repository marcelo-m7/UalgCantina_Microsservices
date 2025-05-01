// Simulação do firebase_options.dart
// Gere este ficheiro com `flutterfire configure` no seu ambiente real.
class DefaultFirebaseOptions {
  static const web = FirebaseOptions(
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID",
  );
}

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