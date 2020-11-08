import chalk from 'chalk';

export function errorLog(err: Error): void {
  return console.log(chalk.red(`\n[ERROR]:\t${err}\n`));
}

export function successLog(origin: string, message: string): void {
  return console.log(chalk.red(`\n[${origin}]:\t${message}\n`));
}
