<?php

return [
    'aistea_qr_export_scans' => [
        'path' => '/aistea-qr/export-scans',
        'target' => \Aistea\AisteaQr\Controller\ScanExportController::class . '::exportAction',
    ],
    'aistea_qr_live_preview' => [
        'path' => '/aistea-qr/live-preview',
        'target' => \Aistea\AisteaQr\Controller\LivePreviewController::class . '::renderAction',
    ],
];
