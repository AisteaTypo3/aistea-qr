<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Aistea QR',
    'description' => 'Create, manage and render dynamic SVG QR codes with backend preview and frontend plugin.',
    'category' => 'fe',
    'author' => 'Yannick Aister',
    'author_email' => 'yannick.aister@medartis.com',
    'state' => 'stable',
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '14.0.0-14.9.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
