# Tuto pour faire une étude de l'évolution de la rose des vents d'un endroit

*Prérequis: Node.js sur Windows / macOS / Linux*

*Public: L'utilisateur averti qui n'est pas un informaticien professionnel*
## Récupérer les données ERA5

Les données ERA5, qui remontent jusqu'au 1959, sont le résultat d'une réanalyse moderne avec un algorithme d'assimilation similaire à ceux qui sont utilisés pour initialiser un modèle météo. Le jeu de données est considéré comme le meilleur jeu de données climatiques au monde et il est diffusé gratuitement par l'ECMWF à toute personne qui en fait la demande.

Aller sur:

https://cds.climate.copernicus.eu/#!/search?text=ERA5&type=dataset

Et choisissez les données de la réanalyse heure par heure sur niveaux de pression:

https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-pressure-levels?tab=overview

ERA5 impose une limite sur la quantité de données que vous pouvez demander en une seule fois - en gros c'est soit toute la France à un moment donné, soit un seul pixel sur 60 ans. Si vous voulez plus, il faudra faire plusieurs demandes.

Les demandes sont traitées sur une liste d'attente - ma première demande a été rejetée au bout d'une semaine d'attente, puis la deuxième fois je l'ai envoyé un samedi soir du mois de juillet - et en 1h30 j'ai eu un email comme quoi les données était prêtes pour téléchargement.

Vous allez obtenir un fichier au format GRIB - qui est très mal adapté à une telle demande puisqu'il va contenir 20000 calques d'un seul pixel.

Pour le vent, il faudra demander à la fois les composantes `U` et `V` - c'est la façon dont on représente le vent dans le monde professionnel de la météo.

Afin d'être sûr d'avoir un seul pixel, limitez la zone géographique à 1/100 d'un degré - par exemple pour la Forclaz donnez: 45.81 au Nord, 6.25 à Est, 45.80 au Sud et 6.24 à l'Ouest.

# Convertir les données en CSV

Lancer `npm install` dans le répertoire du projet pour installer les dépendances.

Lancer ensuite ma moulinette qui utilise mon framework pour JS dont je suis particulièrement fier - `gdal-async` qui est également à la base du moteur de velivole.fr:

```
node grib2csv.js fichier.grib fichier.csv
```

L'erreur `ERROR: Ran out of file reading SECT0` est normale, le fichier ECMWF n'est pas tout à fait aux normes.

Cette moulinette va produire un fichier CSV dans lequel le vent sera représenté avec une vitesse (en m/s) et une direction géographique (0° à 359°) - la façon dont la plupart des gens ont l'habitude d'utiliser.

**Vous pouvez importer ce fichier dans Excel ou Google Sheets.**

# Faire une page avec des roses de vent

Si vous voulez faire une page comme celle sur https://velivole.fr/Forclaz, ouvrez le fichier `src/App.js` et remplacer le `fichier.csv` avec le nom de votre fichier. Copiez ce même fichier CSV dans `public` et lancez:

```
npm run start
````

Ceci lancera votre navigateur web et affichera la page en local.

Si vous voulez l'héberger sur un vrai serveur Web, lancez

```
npm run build
````

puis copiez les données du dossier `build` à la racine de votre serveur web.
