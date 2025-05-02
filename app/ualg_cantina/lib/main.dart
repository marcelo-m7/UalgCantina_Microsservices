import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'routes/app_routes.dart';
import 'pages/login_page.dart';
import 'pages/home_page.dart';
import 'pages/menu_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.web);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UAlg Cantina',
      debugShowCheckedModeBanner: false,
      initialRoute: AppRoutes.login,
      routes: {
        AppRoutes.login: (_) => LoginPage(),
        AppRoutes.home: (_) => HomePage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == AppRoutes.menu) {
          final token = settings.arguments as String;
          return MaterialPageRoute(
            builder: (_) => MenuPage(token: token),
          );
        }
        return null;
      },
    );
  }
}
