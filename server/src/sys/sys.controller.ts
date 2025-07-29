import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { SysService } from './sys.service';
import { ProgramEntity } from '../entities/program.entity';
import { Response } from 'express';

// ?�로그램 ?�성/?�정??DTO ?�??
type CreateProgramDto = Omit<ProgramEntity, 'regDttm' | 'chngDttm' | 'chngrId'>;
type UpdateProgramDto = Partial<CreateProgramDto>;

@Controller('sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}

  // ?�로그램 목록 조회
  @Get('programs')
  async findPrograms(
    @Query('pgmKwd') pgmKwd?: string,
    @Query('pgmDivCd') pgmDivCd?: string,
    @Query('useYn') useYn?: string,
    @Query('bizDivCd') bizDivCd?: string,
  ) {
    try {
      const params = {
        pgmKwd: pgmKwd,
        pgmDivCd: pgmDivCd,
        useYn: useYn,
        bizDivCd: bizDivCd,
      };

      const programs = await this.sysService.findPrograms(params);
      return {
        success: true,
        data: programs,
        message: '?�로그램 목록 조회 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 목록 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '?�로그램 목록 조회 ?�패',
        error: error.message,
      };
    }
  }

  // ?�로그램 ?�성
  @Post('programs')
  async createProgram(@Body() program: CreateProgramDto) {
    try {
      const createdProgram = await this.sysService.createProgram(program);
      return {
        success: true,
        data: createdProgram,
        message: '?�로그램 ?�성 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 ?�성 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 ?�성 ?�패',
        error: error.message,
      };
    }
  }

  // ?�로그램 ?�정
  @Put('programs/:pgmId')
  async updateProgram(@Param('pgmId') pgmId: string, @Body() program: UpdateProgramDto) {
    try {
      const updatedProgram = await this.sysService.updateProgram(pgmId, program);
      return {
        success: true,
        data: updatedProgram,
        message: '?�로그램 ?�정 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 ?�정 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 ?�정 ?�패',
        error: error.message,
      };
    }
  }

  // ===== SYS1002M00: 메뉴 관�?=====
  
  @Get('sys-menus/tree')
  async getMenuTree() {
    try {
      const tree = await this.sysService.getMenuTree();
      return {
        success: true,
        data: tree,
        message: '메뉴 ?�리 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�리 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴 ?�리 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-menus')
  async findAllMenus(@Query() query: any) {
    try {
      const menus = await this.sysService.findAllMenus(query);
      return {
        success: true,
        data: menus,
        message: '메뉴 목록 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴 목록 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴 목록 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-menus/:menuId')
  async findMenuById(@Param('menuId') menuId: string) {
    try {
      const menu = await this.sysService.findMenuById(menuId);
      return {
        success: true,
        data: menu,
        message: '메뉴 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴 조회 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-menus')
  async createMenu(@Body() menuData: any) {
    try {
      const createdMenu = await this.sysService.createMenu(menuData);
      return {
        success: true,
        data: createdMenu,
        message: '메뉴 ?�성 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�성 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�성 ?�패',
        error: error.message,
      };
    }
  }

  @Put('sys-menus/:menuId')
  async updateMenu(@Param('menuId') menuId: string, @Body() menuData: any) {
    try {
      const updatedMenu = await this.sysService.updateMenu(menuId, menuData);
      return {
        success: true,
        data: updatedMenu,
        message: '메뉴 ?�정 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�정 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�정 ?�패',
        error: error.message,
      };
    }
  }

  @Delete('sys-menus/:menuId')
  async deleteMenu(@Param('menuId') menuId: string) {
    try {
      await this.sysService.deleteMenu(menuId);
      return {
        success: true,
        data: null,
        message: '메뉴 ??�� ?�공',
      };
    } catch (error) {
      console.error('메뉴 ??�� ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ??�� ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-menus/:menuId/copy')
  async copyMenu(@Param('menuId') menuId: string, @Body() body: { menuName: string }) {
    try {
      const result = await this.sysService.copyMenu(menuId, body.menuName);
      return {
        success: true,
        data: result,
        message: '메뉴 복사 ?�공',
      };
    } catch (error) {
      console.error('메뉴 복사 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 복사 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-menus/:menuId/tree')
  async getMenuTreeByMenu(@Param('menuId') menuId: string) {
    try {
      console.log('?�� 컨트롤러: getMenuTreeByMenu ?�드?�인???�출 - 메뉴ID:', menuId);
      console.log('?�� ?�청 URL:', `/api/sys/sys-menus/${menuId}/tree`);
      
      const tree = await this.sysService.getMenuTreeByMenu(menuId);
      
      console.log('??컨트롤러: ?�비???�출 ?�료');
      console.log('?�� 반환???�리 ?�이??개수:', tree?.length || 0);
      
      const response = {
        success: true,
        data: tree,
        message: '메뉴 ?�리 조회 ?�공',
      };
      
      console.log('?�� 컨트롤러: ?�답 ?�이??', response);
      
      return response;
    } catch (error) {
      console.error('??컨트롤러: 메뉴 ?�리 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴 ?�리 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-menus/:menuId/details/:parentMenuSeq')
  async getMenuDetails(@Param('menuId') menuId: string, @Param('parentMenuSeq') parentMenuSeq: string) {
    try {
      const details = await this.sysService.getMenuDetails(menuId, parseInt(parentMenuSeq));
      return {
        success: true,
        data: details,
        message: '메뉴 ?�세 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�세 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴 ?�세 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-menus/:menuId/programs')
  async getMenuPrograms(@Param('menuId') menuId: string, @Query('menuSeq') menuSeq?: string) {
    try {
      const programs = await this.sysService.getMenuPrograms(menuId, menuSeq ? parseInt(menuSeq) : undefined);
      return {
        success: true,
        data: programs,
        message: '메뉴�??�로그램 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴�??�로그램 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴�??�로그램 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-menus/:menuId/programs')
  async addMenuProgram(@Param('menuId') menuId: string, @Body() programData: any) {
    try {
      await this.sysService.addMenuProgram(menuId, programData);
      return {
        success: true,
        data: null,
        message: '?�로그램 추�? ?�공',
      };
    } catch (error) {
      console.error('?�로그램 추�? ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 추�? ?�패',
        error: error.message,
      };
    }
  }

  @Delete('sys-menus/:menuId/programs/:menuSeq')
  async deleteMenuProgram(@Param('menuId') menuId: string, @Param('menuSeq') menuSeq: string) {
    try {
      await this.sysService.deleteMenuProgram(menuId, parseInt(menuSeq));
      return {
        success: true,
        data: null,
        message: '메뉴 ?�로그램 ??�� ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�로그램 ??�� ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�로그램 ??�� ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-menus/:menuId/programs/save')
  async saveMenuPrograms(@Param('menuId') menuId: string, @Body() body: { MENU_PGM: any[] }) {
    try {
      console.log('?�� 컨트롤러: saveMenuPrograms ?�드?�인???�출');
      console.log('?�� 메뉴ID:', menuId);
      console.log('?�� ?�?�할 ?�이??', body.MENU_PGM);
      
      await this.sysService.saveMenuPrograms(menuId, body.MENU_PGM);
      
      return {
        success: true,
        data: null,
        message: '메뉴 ?�로그램 ?�???�공',
      };
    } catch (error) {
      console.error('메뉴 ?�로그램 ?�???�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�로그램 ?�???�패',
        error: error.message,
      };
    }
  }

  @Put('sys-menus/:menuId/tree-order')
  async updateMenuTreeOrder(@Param('menuId') menuId: string, @Body() treeData: any[]) {
    try {
      await this.sysService.updateMenuTreeOrder(menuId, treeData);
      return {
        success: true,
        data: null,
        message: '메뉴 ?�리 ?�서 ?�데?�트 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�리 ?�서 ?�데?�트 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�리 ?�서 ?�데?�트 ?�패',
        error: error.message,
      };
    }
  }

  // ?�리 ?�서 ?�데?�트 (SEIZE_TO_BIST 방식)
  @Post('sys-menus/:menuId/update-tree-menu')
  async updateTreeMenu(@Param('menuId') menuId: string, @Body() body: { TREE_MENU: any[] }) {
    try {
      await this.sysService.updateMenuTreeOrder(menuId, body.TREE_MENU);
      return {
        success: true,
        data: null,
        message: '메뉴 ?�리 ?�서 ?�데?�트 ?�공',
      };
    } catch (error) {
      console.error('메뉴 ?�리 ?�서 ?�데?�트 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '메뉴 ?�리 ?�서 ?�데?�트 ?�패',
        error: error.message,
      };
    }
  }

  // ?�플 메뉴 ?�리 ?�이???�성 (?�스?�용)
  @Post('sys-menus/sample-tree')
  async createSampleMenuTree() {
    try {
      await this.sysService.createSampleMenuTree();
      return {
        success: true,
        data: null,
        message: '?�플 메뉴 ?�리 ?�이???�성 ?�공',
      };
    } catch (error) {
      console.error('?�플 메뉴 ?�리 ?�이???�성 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�플 메뉴 ?�리 ?�이???�성 ?�패',
        error: error.message,
      };
    }
  }



  @Get('sys-program-groups')
  async findAllProgramGroups(
    @Query('PGM_GRP_NM') pgmGrpNm?: string,
    @Query('USE_YN') useYn?: string,
  ) {
    try {
      const searchCondition = {
        PGM_GRP_NM: pgmGrpNm,
        USE_YN: useYn,
      };

      console.log('=== 컨트롤러 findAllProgramGroups ?�출??===');
      console.log('검??조건:', searchCondition);

      const result = await this.sysService.findAllProgramGroups(searchCondition);
      
      return {
        success: true,
        data: result,
        message: '?�로그램 그룹 목록 조회 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 그룹 목록 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '?�로그램 그룹 목록 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-program-groups/generate-id')
  async generateProgramGroupId() {
    try {
      const groupId = await this.sysService.generateProgramGroupId();
      return {
        success: true,
        data: { pgmGrpId: groupId },
        message: '?�로그램 그룹 ID ?�성 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 그룹 ID ?�성 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 그룹 ID ?�성 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-program-groups/:groupId')
  async findProgramGroupById(@Param('groupId') groupId: string) {
    try {
      const programGroup = await this.sysService.findProgramGroupById(groupId);
      return {
        success: true,
        data: programGroup,
        message: '?�로그램 그룹 조회 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 그룹 조회 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 그룹 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Get('sys-program-groups/:groupId/programs')
  async findProgramsByGroup(@Param('groupId') groupId: string) {
    try {
      const programs = await this.sysService.findProgramsByGroup(groupId);
      return {
        success: true,
        data: programs,
        message: '그룹�??�로그램 목록 조회 ?�공',
      };
    } catch (error) {
      console.error('그룹�??�로그램 목록 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '그룹�??�로그램 목록 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-program-groups/:groupId/copy')
  async copyProgramGroup(
    @Param('groupId') groupId: string,
    @Res() res: Response,
  ) {
    try {
      const newGroup = await this.sysService.copyProgramGroup(groupId);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: newGroup,
        message: '?�로그램 그룹 복사 ?�공',
      });
    } catch (error) {
      console.error('?�로그램 그룹 복사 ?�패:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ 
          success: false,
          message: '?�로그램 그룹 복사???�패?�습?�다.', 
          error: error.message 
        });
    }
  }

  // ?�로그램 그룹 ?�성
  @Post('sys-program-groups')
  async createProgramGroup(@Body() programGroup: any) {
    try {
      const createdProgramGroup = await this.sysService.createProgramGroup(programGroup);
      return {
        success: true,
        data: createdProgramGroup,
        message: '?�로그램 그룹 ?�성 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 그룹 ?�성 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 그룹 ?�성 ?�패',
        error: error.message,
      };
    }
  }

  // ?�로그램 그룹 ?�정
  @Put('sys-program-groups/:groupId')
  async updateProgramGroup(@Param('groupId') groupId: string, @Body() programGroup: any) {
    try {
      const updatedProgramGroup = await this.sysService.updateProgramGroup(groupId, programGroup);
      return {
        success: true,
        data: updatedProgramGroup,
        message: '?�로그램 그룹 ?�정 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 그룹 ?�정 ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 그룹 ?�정 ?�패',
        error: error.message,
      };
    }
  }

  // ?�로그램 그룹?�서 ?�로그램 ??��
  @Delete('sys-program-groups/:groupId/programs')
  async removeProgramsFromGroup(
    @Param('groupId') groupId: string,
    @Body() body: { programIds: string[] }
  ) {
    try {
      const deletedCount = await this.sysService.removeProgramsFromGroup(groupId, body.programIds);
      return {
        success: true,
        data: { deletedCount },
        message: `${deletedCount}개의 ?�로그램????��?�었?�니??`,
      };
    } catch (error) {
      console.error('?�로그램 ??�� ?�패:', error);
      return {
        success: false,
        data: null,
        message: '?�로그램 ??�� ?�패',
        error: error.message,
      };
    }
  }

  // SYS1000 - ?�로그램 관�?관???�드?�인?�들

  /**
   * ?�로그램 목록 조회
   */
  @Post('programs/list')
  async getProgramList(@Body() searchCondition: any) {
    console.log('=== SYS1000 ?�로그램 목록 조회 API ?�출 ===');
    console.log('검??조건:', searchCondition);
    
    try {
      const result = await this.sysService.getProgramList(searchCondition);
      console.log('?�로그램 목록 조회 ?�료:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('?�로그램 목록 조회 API ?�류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ?�로그램 ?�어 목록 조회
   */
  @Get('programs/:pgmId/languages')
  async getProgramLanguageList(@Param('pgmId') pgmId: string) {
    console.log('=== SYS1000 ?�로그램 ?�어 목록 조회 API ?�출 ===');
    console.log('?�로그램 ID:', pgmId);
    
    try {
      const result = await this.sysService.getProgramLanguageList(pgmId);
      console.log('?�로그램 ?�어 목록 조회 ?�료:', result.length + '�?);
      return { success: true, data: result };
    } catch (error) {
      console.error('?�로그램 ?�어 목록 조회 API ?�류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ?�로그램 ?�보 ?�???�정
   */
  @Post('programs/save')
  async saveProgram(@Body() programData: any) {
    console.log('=== SYS1000 ?�로그램 ?�보 ?�???�정 API ?�출 ===');
    console.log('?�???�이??', programData);
    
    try {
      // ?�규 ?�록??경우 중복 체크
      if (programData.isNew) {
        const exists = await this.sysService.checkProgramIdExists(programData.pgmId);
        if (exists) {
          console.log('?�로그램 ID 중복:', programData.pgmId);
          return { success: false, error: '?��? 존재?�는 ?�로그램 ID?�니??' };
        }
      }

      const result = await this.sysService.saveProgram(programData);
      console.log('?�로그램 ?�보 ?�???�료');
      return result;
    } catch (error) {
      console.error('?�로그램 ?�보 ?�??API ?�류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ?�로그램 ID 중복 체크
   */
  @Get('programs/check/:pgmId')
  async checkProgramId(@Param('pgmId') pgmId: string) {
    console.log('=== SYS1000 ?�로그램 ID 중복 체크 API ?�출 ===');
    console.log('?�로그램 ID:', pgmId);
    
    try {
      const exists = await this.sysService.checkProgramIdExists(pgmId);
      console.log('중복 체크 결과:', exists);
      return { success: true, exists };
    } catch (error) {
      console.error('?�로그램 ID 중복 체크 API ?�류:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SYS1012R00: 메뉴 미리보기 =====
  @Get('sys-menus/:menuId/preview')
  async getMenuPreview(@Param('menuId') menuId: string) {
    console.log('=== SYS1012R00 메뉴 미리보기 API ?�출 ===');
    console.log('메뉴 ID:', menuId);
    
    try {
      const menuPreview = await this.sysService.getMenuPreview(menuId);
      console.log('메뉴 미리보기 조회 ?�료:', menuPreview.length + '�?);
      return {
        success: true,
        data: menuPreview,
        message: '메뉴 미리보기 조회 ?�공',
      };
    } catch (error) {
      console.error('메뉴 미리보기 조회 ?�패:', error);
      return {
        success: false,
        data: [],
        message: '메뉴 미리보기 조회 ?�패',
        error: error.message,
      };
    }
  }

  // ===== SYS1010D00: ?�로그램 찾기 =====
  @Get('programs/search')
  async findProgramsForSearch(
    @Query('PGM_KWD') pgmKwd?: string,
    @Query('PGM_DIV_CD') pgmDivCd?: string,
    @Query('BIZ_DIV_CD') bizDivCd?: string,
    @Query('PGM_GRP_ID') pgmGrpId?: string,
  ) {
    try {
      console.log('=== SYS1010D00 ?�로그램 찾기 API ?�출 ===');
      console.log('검??조건:', { pgmKwd, pgmDivCd, bizDivCd, pgmGrpId });
      
      const searchCondition = {
        PGM_KWD: pgmKwd,
        PGM_DIV_CD: pgmDivCd,
        BIZ_DIV_CD: bizDivCd,
        PGM_GRP_ID: pgmGrpId,
      };
      
      const result = await this.sysService.findProgramsForSearch(searchCondition);
      
      return {
        success: true,
        data: result,
        message: '?�로그램 찾기 조회 ?�공',
      };
    } catch (error) {
      console.error('?�로그램 찾기 API ?�패:', error);
      return {
        success: false,
        data: [],
        message: '?�로그램 찾기 조회 ?�패',
        error: error.message,
      };
    }
  }

  @Post('sys-menus/:menuId/programs/delete-hierarchical')
  async deleteMenuProgramsHierarchical(
    @Param('menuId') menuId: string,
    @Body() body: { menuSeqs: number[] }
  ) {
    try {
      await this.sysService.deleteMenuProgramsHierarchical(menuId, body.menuSeqs);
      return { success: true };
    } catch (error) {
      console.error('계층 ??�� ?�패:', error);
      return { success: false, message: error.message };
    }
  }

  @Post('sys-program-groups/:groupId/programs')
  async addProgramsToGroup(
    @Param('groupId') groupId: string,
    @Body() body: { programIds: string[] }
  ) {
    try {
      const result = await this.sysService.addProgramsToGroup(groupId, body.programIds);
      return { success: true, count: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}


