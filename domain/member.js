class Member {
  constructor(account, password, nickname, birthday) {
    this.sid = 0
    this.account = account
    this.password = password
    this.nickname = nickname
    this.birthday = birthday
  }

  // 註冊使用
  addMemberSQL() {
    let sql = `INSERT INTO members(account, nickname, password, birthday) \
                   VALUES('${this.account}', '${this.nickname}', '${this.password}', '${this.birthday}')`
    return sql
  }

  // login使用
  getMemberByAccountAndPasswordSQL() {
    let sql = `SELECT * FROM members WHERE account = '${this.account}' AND password =  '${this.password}' LIMIT 0,1`
    return sql
  }  

  // 讀取會員資料使用  
  static getMemberByIdSQL(sid) {
    let sql = `SELECT * FROM members WHERE sid = ${sid}`
    return sql
  }  
  
  // 更新會員資料使用 
 updateMemberByIdSQL(sid) {
    let sql = `UPDATE members \
               SET password = '${this.password}', nickname = '${this.nickname}', birthday = '${this.birthday}' \
               WHERE sid =  ${sid}`
    return sql
  }
}

//export default Member
module.exports = Member
