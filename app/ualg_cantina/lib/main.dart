import 'package:flutter/material.dart';
import 'pages/login_page.dart';
import 'pages/home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      onGenerateRoute: (settings) {
        final uri = Uri.parse(settings.name ?? "");
        final isTokenPage = uri.path == "/token" && uri.queryParameters.containsKey("token");

        if (isTokenPage) {
          final jwt = uri.queryParameters["token"]!;
          return MaterialPageRoute(builder: (_) => HomePage(jwt: jwt));
        }

        return MaterialPageRoute(builder: (_) => const LoginPage());
      },
    );
  }
}
