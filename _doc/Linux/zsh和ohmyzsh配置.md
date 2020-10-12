- [1、 前言](#1)
- [2、 启用 zsh](#2)
- [3、 安装 oh-my-zsh 和常用插件](#3)
  - [3.1、 安装 oh-my-zsh](#31)
  - [3.2、 安装 zsh-autosuggestions 插件](#32)
  - [3.3、 安装 zsh-syntax-highlighting 插件](#33)
- [4、 zsh 中启用插件](#4)
- [5、 注意事项](#5)
- [6、 更改主题](#6)
<h2  id="1"> 前言</h2>
总所周知，当前主流的Linux发行都是内置了很多命令解释器，默认Bash，大家用的都比较习惯。直到出现了zsh，很多Linux爱好者和程序员都纷纷转向使用它，我最近也切换使用zsh，发现它确实很强大，不仅逼格高，而且一定程度上也提高了我的工作效率。它的强大之处主要体现在更强的命令补全（如智能切换命令的大小写）、命令高亮、支持自定义配置、支持扩展等。
<h2  id="2"> 启用zsh</h2>

* 查看系统当前使用的 shell

```
echo $SHELL
```

- 查看平台支持的所有 shell:

```
cat /etc/shells
```

![view shell](https://user-gold-cdn.xitu.io/2020/7/19/17367048703ee579?w=392&h=200&f=png&s=9026)

- 安装 zsh

红帽系列发行版 :

```
yum install -y zsh
```

或 debian 系列发行版 :

```
apt-get install -y zsh
```

或 ArchLinux 系列发行版 :

```
pacman -S zsh
```

- 启用 zsh

```
chsh -s /bin/zsh
```

> 一般内置的 root 用户执行会失败,无法更改 shell, 可执行以下命令生效 `/bin/zsh`

<h2  id="3"> 安装oh-my-zsh和常用插件</h2>

> 安利几款实用的插件: git, z, extract, zsh-autosuggestions, zsh-syntax-highlighting, brew, web-search;
> 查看 oh-my-zsh 内置的插件种类: ls -l ~/.oh-my-zsh/plugins/

<h3  id="31"> 安装oh-my-zsh</h3>

```
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

<h3  id="32"> 安装 zsh-autosuggestions 插件</h3>

```
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

<h3  id="33"> 安装 zsh-syntax-highlighting 插件</h3>

```
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

<h2  id="4"> zsh中启用插件</h2>

```
vim ~/.zshrc
```

![](https://user-gold-cdn.xitu.io/2020/7/19/1736710f27d2c581?w=598&h=172&f=png&s=15365)
简单介绍一下上图启用的插件：  
git 插件默认开启，可识别当前命令所在的项目和分支名，
zsh-autosuggestions 插件会在输入命令时给出建议的命令（灰色部分），按键盘 → 补全，如下图所示

![](https://user-gold-cdn.xitu.io/2020/7/19/173671cca9bf8363?w=490&h=82&f=png&s=7858)
zsh-syntax-highlighting 插件在正确的命令时会绿色高亮显示，输入错误会显示其他的颜色。
brew 是 OS X 系统中 honeyBrew 包管理器安装软件使用的命令，可自行选择安装。z 插件是 oh-my-zsh 自带的插件，功能和 autojump 类似，可记忆之前 cd 过的所有路径，真的很强大。

![](https://user-gold-cdn.xitu.io/2020/7/19/1736724cbf610674?w=775&h=311&f=png&s=39102)
输入 z 列举之前 cd 过的所有目录，z + 目录名可直接进入这个目录，很快捷。

<h2  id="5"> 注意事项</h2>
不推荐安装autojump这个插件，因为自带的z插件和它功能一样，关键是zutojump和tmux冲突（如果同时安装这两者，会导致每次打开terminal时报各种莫名奇妙的错误，网上查阅了很多资料才发现是autojump导致的，具体为啥冲突暂不清楚，很恶心）

<h2  id="6"> 更改主题</h2>

> 先查看可选的主题种类: ls -l ~/.oh-my-zsh/themes/, 推荐一款很惊艳的主题 **ys**

```
vim ~/.zshrc
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c50dc3d992844554979eebee94055fe7~tplv-k3u1fbpfcp-zoom-1.image)

更改后效果

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f67ec5c227946789fa4988d5f055e5c~tplv-k3u1fbpfcp-zoom-1.image)
