<?php

return [
    'frontend' => [
        'aistea/aistea-qr/qr-resolver' => [
            'target' => \Aistea\AisteaQr\Middleware\QrResolverMiddleware::class,
            'before' => [
                'typo3/cms-frontend/site',
            ],
        ],
        'aistea/aistea-qr/svg' => [
            'target' => \Aistea\AisteaQr\Middleware\SvgMiddleware::class,
            'after' => [
                'typo3/cms-frontend/site',
            ],
        ],
    ],
];
