declare global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    list: T;
    /**
     * 数据总数
     */
    total: number;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 是否显示
     */
    visible: boolean;
  }
}
export {};
