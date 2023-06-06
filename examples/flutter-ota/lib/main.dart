import 'package:flutter/material.dart';
import 'package:lokalise_flutter_sdk/lokalise_flutter_sdk.dart';
import 'package:to_do_app/app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Lokalise.init(
    projectId: '31578657647e4fa8187124.50708679/', // Fill with your project id
    sdkToken: 'af532a3467141578022716c4297aa5705f17', // Fill with your SDK token
  );
  runApp(const App());
}
