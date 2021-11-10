/**
 * MixinDefinitions
 * Symbols used to make sure there are no name collisions
 * Definitions used to let developers know a mixin is used
 * within a component and where the function originates from
 */

export const MixinDefs = {
  onRemove: Symbol('onRemove'),
  onRemoveObserver: Symbol('onRemoveObserver'),
}

export default MixinDefs
