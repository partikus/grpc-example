<?php declare(strict_types=1);

namespace App;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class StreamTweetsCommand extends Command
{

    protected function configure()
    {
        $this
            ->setName('app:stream')
            ->addArgument('query', InputArgument::REQUIRED)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $query = $input->getArgument('query');

        $client = new \Kruczek\RgDev\Twitter\TwitterBoardClient('localhost:50051', [
            'credentials' => \Grpc\ChannelCredentials::createInsecure(),
        ]);

        $request = new \Kruczek\RgDev\Twitter\Query();
        $request->setQ($query);
        $request->setType(\Kruczek\RgDev\Twitter\ResultType::RECENT);
        /** @var \Grpc\ServerStreamingCall $streaming */
        $streaming = $client->GetTweets($request);
        /** @var \Kruczek\RgDev\Twitter\Tweet $response */

        $table = new Table($output);
        $table->render();
        $lines = 0;

        foreach ($streaming->responses() as $response) {
            $lines++;
            $message = implode("\t", [
                mb_substr($response->getId(), 0, 5),
                $response->getFavoriteCount(),
                $response->getRetweetCount(),
                $response->getAuthor()->getScreenName(),
                $response->getText()
            ]);
            $output->writeln($message);
        }
    }
}
