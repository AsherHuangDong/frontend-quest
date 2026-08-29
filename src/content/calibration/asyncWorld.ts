import type { CalibrationDefinition } from '../../domain/calibration/types';
import { asyncWorld } from '../knowledge/asyncWorld';

/**
 * Async World calibration: small probe set aligned with PROJECT_SPEC.
 * Q1 Promise → Q2 Microtask/Event Loop → Q3 async/await
 */
export const asyncWorldCalibration: CalibrationDefinition = {
  id: 'async-world-calibration',
  worldId: asyncWorld.id,
  questIds: ['promise-basics', 'event-loop', 'async-await-final'],
};
