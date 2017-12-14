<?php declare(strict_types=1);

namespace App;

use Kruczek\RgDev\Twitter\Query;
use Kruczek\RgDev\Twitter\ResultType;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class StreamTweetsCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('app:stream')
            ->addArgument('tracks', InputArgument::OPTIONAL, 'Comma separated tracks.', '')
            ->addArgument('users', InputArgument::OPTIONAL, 'Comma separated users', '')
            ->addOption('hostname', null, InputOption::VALUE_OPTIONAL, 'gRPC hostname:port', 'localhost:50051');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $lastId = 0;
        $tracks = explode(',', $input->getArgument('tracks'));
        $follows = empty($input->getArgument('users')) ? [] : explode(',', $input->getArgument('users'));
        $hostname = $input->getOption('hostname');

        $client = new Client($hostname);
        $cliDecorator = new CliDecorator($output);

        do {
            $query = $this->buildQuery($lastId, $follows, $tracks);
            foreach ($client->getTweets($query) as $tweet) {
                if ($tweet->getId() > $lastId) {
                    $lastId = $tweet->getId();
                }
                $cliDecorator->decorate($tweet);
                unset($tweet);
            }
            sleep(5);
        } while(true);
    }

    private function buildQuery($lastId, $follows, $tracks): Query
    {
        $query = new Query();
        empty($follows) ?: $query->setFollows($follows);
        empty($tracks) ?: $query->setTracks($tracks);
        $query->setSince($lastId);
        $query->setType(ResultType::RECENT);

        return $query;
    }
}
