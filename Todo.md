
# App
  [ ] Home.vue - 어떻게할까저걸
  [ ] Currencies.vue - 색조합을 보라색 -> 녹색으로

# Vuestagram
  [ ] - Profile이 Vuestagram 베이스로 되어 있는데 이걸 따로 분류하면 좋을 것 같음 (views/Users.vue로 이동?)

# Blog
  [ ] Font-size - Slider 보다는 Scale Up&Down + 직접 입력이 더 편할듯
  [ ] Code block - Javascript용 코드블럭이랑 일반 코드 입력용 코드블럭을 나눠서 사용 (가능?)
  [ ] Categories - 어떻게 할 지 생각해 봐야 할듯
  [ ] Comment - 구현해야 함
  [ ] Image system - 이미지들을 먼저 temp에 올려놓고 Article을 업로드 시킬 때 blogs/{{_id}}로 이동시키는 편이 관리하기 편할듯. 나중에 article delete 시킬 때 폴더 째로 지우면                    깔끔함. New article 시에는 temp -> blogs/{{(_id)}}로 가고 edit에서는 바로 blogs/{{_id}}에 저장하고 store상에서만 temp에 넣어놨다 취소할 때                         store temp에 있는거만 지우면 될듯?