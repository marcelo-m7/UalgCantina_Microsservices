import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  final String loginUrl = "http://localhost:8000/login?redirect=http://localhost:5000/token";

  Future<void> openLogin() async {
    final uri = Uri.parse(loginUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      throw 'Não foi possível abrir o navegador';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: openLogin,
          child: const Text("Entrar com Google"),
        ),
      ),
    );
  }
}
