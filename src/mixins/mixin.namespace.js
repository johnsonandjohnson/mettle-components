/**
 * MixinNS(NameSpace)
 * Symbols used to make sure there are no name collisions
 * Namespace used to let developers know a mixin is used
 * within a component and where the function/property originates from
 */

export const MixinNS = {
  DataModel: Symbol('DataModel'),
  DefaultDataModel: Symbol('DefaultDataModel'),
  HTMLMarker: Symbol('HTMLMarker'),
  Subscription: Symbol('Subscription'),
  onModelUpdate: Symbol('onModelUpdate'),
  onRemove: Symbol('onRemove'),
  onRemoveObserver: Symbol('onRemoveObserver'),
  resetDataModel: Symbol('resetDataModel'),
  updateDataModel: Symbol('updateDataModel'),
}

export default MixinNS
