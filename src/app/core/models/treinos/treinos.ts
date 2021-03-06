import { Exercicios } from './exercicios';

export class Treinos{
    
    idTreinoUsuario: number;
    executado: boolean;
    tempoTreino: number;
    treinando: boolean;
    dataExecucao: string;
    semanaDia: string;
    divisao: string;
    qtdExercicios: number;
    intervalo: string;
    grupos: string[];
    exercicios: Exercicios[]
}