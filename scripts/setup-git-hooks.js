// Script pour configurer les Git Hooks
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const gitHooksDir = path.join(rootDir, '.git', 'hooks');

// Fonction principale
async function main() {
  console.log(chalk.blue.bold('=== CONFIGURATION DES GIT HOOKS ==='));
  console.log(chalk.blue('Configuration des hooks Git pour l\'automatisation SEO'));
  console.log('');

  try {
    // Vérifier si le dossier .git existe
    try {
      await fs.access(path.join(rootDir, '.git'));
    } catch (error) {
      console.error(chalk.red('Erreur: Ce projet n\'est pas un dépôt Git.'));
      console.log(chalk.yellow('Initialisez d\'abord un dépôt Git avec `git init`.'));
      process.exit(1);
    }

    // Créer le dossier hooks s'il n'existe pas
    try {
      await fs.access(gitHooksDir);
    } catch (error) {
      await fs.mkdir(gitHooksDir, { recursive: true });
      console.log(chalk.green(`Dossier créé: ${gitHooksDir}`));
    }

    // Créer le hook pre-commit
    await createPreCommitHook();

    // Créer le hook pre-push
    await createPrePushHook();

    console.log('');
    console.log(chalk.green.bold('✓ Git Hooks configurés avec succès'));
    console.log(chalk.blue('Les vérifications SEO seront exécutées automatiquement lors des commits et des push.'));
  } catch (error) {
    console.error(chalk.red('Erreur lors de la configuration des Git Hooks:'), error);
  }
}

// Créer le hook pre-commit
async function createPreCommitHook() {
  console.log(chalk.yellow.bold('1. Configuration du hook pre-commit'));

  const preCommitPath = path.join(gitHooksDir, 'pre-commit');
  const preCommitContent = `#!/bin/sh
# Hook pre-commit pour les vérifications SEO

echo "\\033[34m=== VÉRIFICATIONS SEO PRÉ-COMMIT ===\\033[0m"

# Exécuter les vérifications SEO de base
npm run seo:analyze

# Vérifier le code de sortie
if [ $? -ne 0 ]; then
  echo "\\033[31mErreur: Les vérifications SEO ont échoué. Commit annulé.\\033[0m"
  echo "\\033[33mCorrigez les problèmes SEO avant de committer à nouveau.\\033[0m"
  exit 1
fi

echo "\\033[32m✓ Vérifications SEO réussies\\033[0m"
exit 0
`;

  await fs.writeFile(preCommitPath, preCommitContent, 'utf-8');
  await fs.chmod(preCommitPath, 0o755); // Rendre le fichier exécutable
  console.log(chalk.green(`Hook pre-commit créé: ${preCommitPath}`));
}

// Créer le hook pre-push
async function createPrePushHook() {
  console.log(chalk.yellow.bold('\n2. Configuration du hook pre-push'));

  const prePushPath = path.join(gitHooksDir, 'pre-push');
  const prePushContent = `#!/bin/sh
# Hook pre-push pour les vérifications SEO complètes

echo "\\033[34m=== VÉRIFICATIONS SEO PRÉ-PUSH ===\\033[0m"

# Exécuter les vérifications SEO complètes
npm run seo:auto

# Vérifier le code de sortie
if [ $? -ne 0 ]; then
  echo "\\033[31mErreur: Les optimisations SEO ont échoué. Push annulé.\\033[0m"
  echo "\\033[33mCorrigez les problèmes SEO avant de push à nouveau.\\033[0m"
  exit 1
fi

echo "\\033[32m✓ Optimisations SEO réussies\\033[0m"
exit 0
`;

  await fs.writeFile(prePushPath, prePushContent, 'utf-8');
  await fs.chmod(prePushPath, 0o755); // Rendre le fichier exécutable
  console.log(chalk.green(`Hook pre-push créé: ${prePushPath}`));
}

// Exécuter le script
main().catch(error => {
  console.error(chalk.red('Erreur lors de l\'exécution du script:'), error);
  process.exit(1);
});
