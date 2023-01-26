import { Vertex } from '../types';
import calculateColor from './calculateColor';

export default function getFaceColor(face: Vertex[]) {
  return calculateColor(face[0]);
}
