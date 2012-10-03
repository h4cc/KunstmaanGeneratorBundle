<?php

namespace Kunstmaan\GeneratorBundle\Command;

use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Output\Output;
use Sensio\Bundle\GeneratorBundle\Command\GenerateDoctrineCommand;
use Sensio\Bundle\GeneratorBundle\Command\Helper\DialogHelper;
use Sensio\Bundle\GeneratorBundle\Generator;

use Kunstmaan\GeneratorBundle\Generator\DefaultSiteGenerator;

/**
 * Generates a default website based on Kunstmaan bundles
 */
class GenerateDefaultSiteCommand extends GenerateDoctrineCommand
{

    private $siteGenerator;

    /**
     * @see Command
     */
    protected function configure()
    {
        $this
            ->setDefinition(
                array(
                     new InputOption('namespace', '', InputOption::VALUE_REQUIRED, 'The namespace to generate the default website in'),
                     new InputOption('prefix', '', InputOption::VALUE_OPTIONAL, 'The prefix to be used in the table names of the generated entities')
                )
            )
            ->setDescription('Generates a basic website based on Kunstmaan bundles with default templates')
            ->setHelp(<<<EOT
The <info>kuma:generate:site</info> command generates an website using the Kunstmaan bundles

<info>php app/console kuma:generate:default-site --namespace=Namespace\NamedBundle</info>

User the <info>--prefix</info> option to add a prefix to the table names of the generated entities

<info>php app/console kuma:generate:default-site --namespace=Namespace\NamedBundle --prefix=demo_</info>
EOT
            )
            ->setName('kuma:generate:default-site');
    }

    /**
     * Executes the command.
     *
     * @param InputInterface  $input  An InputInterface instance
     * @param OutputInterface $output An OutputInterface instance
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dialog = $this->getDialogHelper();

        foreach (array('namespace') as $option) {
            if (null === $input->getOption($option)) {
                throw new \RuntimeException(sprintf('The "%s" option must be provided.', $option));
            }
        }

        $bundle = $input->getOption('namespace');
        $prefix = $input->getOption('prefix');
        $bundle = $this
            ->getApplication()
            ->getKernel()
            ->getBundle($bundle);
        $dialog->writeSection($output, 'Site Generation');
        $rootDir = $this->getApplication()->getKernel()->getRootDir();

        $siteGenerator = $this->getSiteGenerator();
        $siteGenerator->generate($bundle, $prefix, $output, $rootDir);

    }

    /**
     * @return DialogHelper
     */
    protected function getDialogHelper()
    {
        $dialog = $this
            ->getHelperSet()
            ->get('dialog');
        if (!$dialog || get_class($dialog) !== 'Sensio\Bundle\GeneratorBundle\Command\Helper\DialogHelper') {
            $this
                ->getHelperSet()
                ->set($dialog = new DialogHelper());
        }

        return $dialog;
    }

    /**
     * @return DefaultSiteGenerator
     */
    protected function getSiteGenerator()
    {
        if (null === $this->siteGenerator) {
            $this->siteGenerator = new DefaultSiteGenerator($this
                ->getContainer()
                ->get('filesystem'), __DIR__ . '/../Resources/skeleton/defaultsite');
        }

        return $this->siteGenerator;
    }

    /**
     * @param DefaultSiteGenerator $siteGenerator
     */
    public function setSiteGenerator(DefaultSiteGenerator $siteGenerator)
    {
        $this->siteGenerator = $siteGenerator;
    }

}