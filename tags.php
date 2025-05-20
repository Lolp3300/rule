<?php
function fetch_xml($url) {
    $xml = @simplexml_load_file($url);
    if ($xml === false) {
        die("Erreur de chargement : $url");
    }
    return $xml;
}

// 1. Récupérer les alias
$alias_url = "https://api.rule34.xxx/index.php?page=dapi&s=tag_alias&q=index";
$alias_xml = fetch_xml($alias_url);
$aliases = [];

foreach ($alias_xml->tag_alias as $a) {
    $alias = (string)$a['alias'];
    $target = (string)$a['tag'];
    $aliases[] = ['alias' => $alias, 'tag' => $target];
}

// 2. Récupérer tous les tags et leur popularité
$tag_url = "https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index";
$tag_xml = fetch_xml($tag_url);
$tag_counts = [];

foreach ($tag_xml->tag as $t) {
    $name = (string)$t['name'];
    $count = (int)$t['count'];
    $tag_counts[$name] = $count;
}

// 3. Associer alias + popularité
$alias_with_counts = [];

foreach ($aliases as $a) {
    $target = $a['tag'];
    if (isset($tag_counts[$target])) {
        $alias_with_counts[] = [
            'alias' => $a['alias'],
            'tag' => $target,
            'count' => $tag_counts[$target]
        ];
    }
}

// 4. Trier par popularité décroissante
usort($alias_with_counts, function($a, $b) {
    return $b['count'] - $a['count'];
});
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Alias populaires de Rule34</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 24px; }
        ul { list-style: none; padding: 0; }
        li { padding: 4px 0; }
    </style>
</head>
<body>
    <h1>Alias de tags les plus populaires (Rule34)</h1>
    <ul>
        <?php foreach (array_slice($alias_with_counts, 0, 100) as $item): ?>
            <li>
                <?= htmlspecialchars($item['alias']) ?> → 
                <?= htmlspecialchars($item['tag']) ?> (<?= $item['count'] ?>)
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
