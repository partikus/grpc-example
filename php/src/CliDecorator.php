<?php

namespace App;

use Kruczek\RgDev\Twitter\Tweet;
use Symfony\Component\Console\Output\OutputInterface;

class CliDecorator
{
    private $output;

    public function __construct(OutputInterface $output)
    {
        $this->output = $output;
    }

    public function decorate(Tweet $tweet): void
    {
        $message = sprintf(
            "%s (L: %d, R: %d) \t %s: \n%s",
            $tweet->getAuthor()->getScreenName(),
            (int)$tweet->getFavoriteCount(),
            (int)$tweet->getRetweetCount(),
            $tweet->getId(),
            $tweet->getText()
        );

        $this->output->writeln($message);
    }
}
