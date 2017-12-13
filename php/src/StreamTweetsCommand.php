<?php declare(strict_types=1);

namespace App;

use Grpc\ChannelCredentials;
use Grpc\ServerStreamingCall;
use Kruczek\RgDev\Twitter\Query;
use Kruczek\RgDev\Twitter\ResultType;
use Kruczek\RgDev\Twitter\Tweet;
use Kruczek\RgDev\Twitter\TwitterBoardClient;
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
        $lastId = file_get_contents('lastid.txt') ?? 0;
        $follows = explode(',', $input->getArgument('users'));
        $tracks = explode(',', $input->getArgument('tracks'));
        $hostname = $input->getOption('hostname');

        $client = new TwitterBoardClient($hostname, ['credentials' => ChannelCredentials::createInsecure()]);

        for ($i = 0; $i < 10; $i++) {
            foreach ($this->loadSince($client, $lastId, $follows, $tracks)->responses() as $response) {
                $output->writeln($response->getId());
                if ($lastId < $response->getId()) {
                    file_put_contents('lastid.txt', $lastId = $response->getId());
                }
                $this->printTweet($response, $output);
                unset($response);
            }
            sleep(5);
        }
    }

    private function printTweet(Tweet $response, OutputInterface $output)
    {
        $message = implode("\t", [
            mb_substr($response->getId(), 0, 5),
            $response->getFavoriteCount(),
            $response->getRetweetCount(),
            $response->getAuthor()->getScreenName(),
            $response->getText()
        ]);
        $output->writeln($message);
    }

    private function loadSince(TwitterBoardClient $client, $lastId, $follows, $tracks): ServerStreamingCall
    {
        $request = new Query();
        empty($follows) ?: $request->setFollows($follows);
        empty($tracks) ?: $request->setTracks($tracks);
        $request->setSince($lastId);
        $request->setType(ResultType::RECENT);

        return $client->GetTweets($request);
    }
}
