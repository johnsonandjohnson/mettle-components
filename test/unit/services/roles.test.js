import { Roles as RolesService} from 'services'
import { wait } from 'helper'

const ROLES = {
  ADMIN: 'admin',
  MOD: 'mod'
}
describe('RolesService', () => {

  beforeAll(() => {
    RolesService.setDefaultRights({
      allUsers: true,
      modUser: false,
      adminUser: false
    }).setRightsConfig(ROLES.ADMIN, {
      adminUser: true,
      modUser: false,
    }).setRightsConfig(ROLES.MOD, {
      modUser: true,
      adminUser: false
    })
  })

  beforeEach(() => {
    RolesService.UserRoles = []
  })

  describe('functions', () => {
    it('should allow functions when configured for all users', () => {
      const rightsConfig = RolesService.AccessRights
      expect(rightsConfig.allUsers).toBeTrue()
      expect(rightsConfig.modUser).toBeFalse()
      expect(rightsConfig.adminUser).toBeFalse()

    })

    it('should enable functions when user roles are met', () => {
      RolesService.UserRoles = [ROLES.MOD]
      const rightsConfig = RolesService.AccessRights
      expect(rightsConfig.allUsers).toBeTrue()
      expect(rightsConfig.modUser).toBeTrue()
      expect(rightsConfig.adminUser).toBeFalse()
    })

    it('should return a default roles config object', () => {
      const rightsConfig = RolesService.AccessRights
      expect(rightsConfig).toEqual(jasmine.any(Object))
    })

    it('should hide elements based on roles', async () => {
      RolesService.enforceElementRoles()
      document.body.insertAdjacentHTML('afterbegin', `<div id="divToHide" ${RolesService.AttrRoleKey}="modUser"></div>`)
      await wait(100)
      const div = document.querySelector('#divToHide')
      expect(div.hasAttribute('hidden')).toBeTrue()
      RolesService.disconnectObserver()
      expect(RolesService.isObserverEnabled()).toBeFalse()
      div.remove()
    })

    it('should allow for a custom attribute key based role', async () => {
      RolesService.enforceElementRoles()
      const ORIGINAL_KEY = RolesService.AttrRoleKey
      const NEW_ATTR_ROLE_KEY = 'data-role-check'
      document.body.insertAdjacentHTML('afterbegin', `<div id="divToHide" ${NEW_ATTR_ROLE_KEY}="modUser"></div>`)
      RolesService.AttrRoleKey = NEW_ATTR_ROLE_KEY
      await wait(50)
      const div = document.querySelector('#divToHide')
      expect(div.hasAttribute('hidden')).toBeTrue()
      div.remove()
      RolesService.AttrRoleKey = ORIGINAL_KEY
    })

    it('should allow for an inverted role', async () => {
      RolesService.enforceElementRoles()
      document.body.insertAdjacentHTML('afterbegin', `<div id="divToHide" ${RolesService.AttrRoleKey}="!modUser"></div>`)
      RolesService.UserRoles = [ROLES.MOD]
      await wait(100)
      const div = document.querySelector('#divToHide')
      expect(div.hasAttribute('hidden')).toBeTrue()
      div.remove()
      RolesService.disconnectObserver()
    })

    it('should calculate rights correctly', () => {
      const DEFAULT_RIGHTS = RolesService.DefaultRights
      const rights = RolesService.RightsConfig
      let newRights = RolesService._mergeRights(DEFAULT_RIGHTS, rights.get(ROLES.ADMIN))
      expect(newRights.modUser).toBeFalse()
      expect(newRights.adminUser).toBeTrue()

      newRights = RolesService._mergeRights(DEFAULT_RIGHTS, rights.get(ROLES.MOD))
      expect(newRights.modUser).toBeTrue()
      expect(newRights.adminUser).toBeFalse()
    })

  })

})
