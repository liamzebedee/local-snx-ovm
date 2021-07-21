
cd ./projects

for PROJECT in */ ; do
    cd $PROJECT
    BRANCH=$(git describe --all --exact-match 2>/dev/null | sed 's=.*/==')
    printf "%20s %30s\n" "$PROJECT" "$BRANCH"
    cd ..
done