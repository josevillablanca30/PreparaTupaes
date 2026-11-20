import {CompetitionClient,errors} from '../competition-client.mjs';
import {installLearningCompetition} from './competition-client-adapter.mjs';
installLearningCompetition(CompetitionClient,errors);
